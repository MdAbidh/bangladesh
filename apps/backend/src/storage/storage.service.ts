import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { Bucket, File } from '@google-cloud/storage';
import { extname, basename } from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private bucket: Bucket;
  private initialized = false;

  constructor(private readonly configService: ConfigService) {
    this.initialize();
  }

  private initialize(): void {
    try {
      const projectId = this.configService.get<string>('firebase.projectId');
      const clientEmail = this.configService.get<string>('firebase.clientEmail');
      const privateKey = this.configService.get<string>('firebase.privateKey');
      const storageBucket = this.configService.get<string>('firebase.storageBucket');

      if (!projectId || !clientEmail || !privateKey) {
        this.logger.warn('Firebase config incomplete - storage service will not be initialized');
        return;
      }

      const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

      if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: formattedPrivateKey,
          }),
          storageBucket: storageBucket || `${projectId}.appspot.com`,
          databaseURL: this.configService.get<string>('firebase.databaseUrl'),
        });
      }

      this.bucket = admin.storage().bucket();
      this.initialized = true;
      this.logger.log('Firebase Storage initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize Firebase Storage: ${(error as Error).message}`);
    }
  }

  private ensureInitialized(): void {
    if (!this.initialized || !this.bucket) {
      throw new Error('Storage service is not initialized. Check Firebase configuration.');
    }
  }

  private generateFilePath(destination: string): string {
    const ext = extname(destination);
    const name = basename(destination, ext);
    const dir = destination.substring(0, destination.lastIndexOf('/') + 1) || '';
    return `${dir}${name}-${uuidv4()}${ext}`;
  }

  async uploadFile(buffer: Buffer, destination: string, contentType: string): Promise<string> {
    this.ensureInitialized();

    try {
      const filePath = this.generateFilePath(destination);
      const file = this.bucket.file(filePath);

      await file.save(buffer, {
        metadata: { contentType },
      });

      const publicUrl = this.getPublicUrl(filePath);
      this.logger.log(`File uploaded: ${filePath}`);
      return publicUrl;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${(error as Error).message}`);
      throw new Error(`Storage upload failed: ${(error as Error).message}`);
    }
  }

  async uploadFromPath(localPath: string, destination: string): Promise<string> {
    this.ensureInitialized();

    try {
      const buffer = await fs.readFile(localPath);
      const contentType = this.getContentType(destination);
      const publicUrl = await this.uploadFile(buffer, destination, contentType);
      await fs.unlink(localPath).catch(() => {});
      return publicUrl;
    } catch (error) {
      this.logger.error(`Failed to upload from path: ${(error as Error).message}`);
      throw new Error(`Storage upload from path failed: ${(error as Error).message}`);
    }
  }

  async deleteFile(url: string): Promise<void> {
    this.ensureInitialized();

    try {
      const filePath = this.extractFilePathFromUrl(url);
      if (!filePath) {
        throw new Error(`Could not extract file path from URL: ${url}`);
      }

      await this.bucket.file(filePath).delete();
      this.logger.log(`File deleted: ${filePath}`);
    } catch (error) {
      if ((error as Record<string, unknown>).code === 404) {
        this.logger.warn(`File not found for deletion: ${url}`);
        return;
      }
      this.logger.error(`Failed to delete file: ${(error as Error).message}`);
      throw new Error(`Storage delete failed: ${(error as Error).message}`);
    }
  }

  async getSignedUrl(filePath: string, expiresInMinutes = 60): Promise<string> {
    this.ensureInitialized();

    try {
      const [url] = await this.bucket.file(filePath).getSignedUrl({
        action: 'read',
        expires: Date.now() + expiresInMinutes * 60 * 1000,
      });

      return url;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${(error as Error).message}`);
      throw new Error(`Storage signed URL generation failed: ${(error as Error).message}`);
    }
  }

  getPublicUrl(filePath: string): string {
    const storageBucket = this.configService.get<string>('firebase.storageBucket')
      || `${this.configService.get<string>('firebase.projectId')}.appspot.com`;
    return `https://storage.googleapis.com/${storageBucket}/${filePath}`;
  }

  async listFiles(prefix: string): Promise<string[]> {
    this.ensureInitialized();

    try {
      const [files] = await this.bucket.getFiles({ prefix });
      return files.map((file: File) => file.name);
    } catch (error) {
      this.logger.error(`Failed to list files: ${(error as Error).message}`);
      throw new Error(`Storage list files failed: ${(error as Error).message}`);
    }
  }

  async copyFile(sourcePath: string, destinationPath: string): Promise<string> {
    this.ensureInitialized();

    try {
      const sourceFile = this.bucket.file(sourcePath);
      const [copiedFile] = await sourceFile.copy(destinationPath);

      const publicUrl = this.getPublicUrl(copiedFile.name);
      this.logger.log(`File copied: ${sourcePath} -> ${destinationPath}`);
      return publicUrl;
    } catch (error) {
      this.logger.error(`Failed to copy file: ${(error as Error).message}`);
      throw new Error(`Storage copy failed: ${(error as Error).message}`);
    }
  }

  private extractFilePathFromUrl(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      const pathParts = parsedUrl.pathname.split('/');
      const bucketIndex = pathParts.findIndex(
        (part) => part === this.bucket.name || part.endsWith('.appspot.com'),
      );

      if (bucketIndex === -1) {
        pathParts.shift();
        return pathParts.join('/');
      }

      return pathParts.slice(bucketIndex + 1).join('/');
    } catch {
      return null;
    }
  }

  private getContentType(filePath: string): string {
    const ext = extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mov': 'video/quicktime',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.zip': 'application/zip',
      '.json': 'application/json',
      '.csv': 'text/csv',
      '.txt': 'text/plain',
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
}
