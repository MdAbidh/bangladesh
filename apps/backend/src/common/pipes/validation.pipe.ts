import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Type,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<unknown> {
  async transform(value: unknown, { metatype }: ArgumentMetadata): Promise<unknown> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value, {
      enableImplicitConversion: true,
      excludeExtraneousValues: false,
    });

    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      skipMissingProperties: false,
      validationError: { target: false, value: false },
    });

    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    return object;
  }

  private toValidate(metatype: Type<unknown>): boolean {
    const types: Type<unknown>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[], parentProperty = ''): Record<string, string[]> {
    const formatted: Record<string, string[]> = {};

    for (const error of errors) {
      const propertyPath = parentProperty
        ? `${parentProperty}.${error.property}`
        : error.property;

      if (error.constraints) {
        formatted[propertyPath] = Object.values(error.constraints);
      }

      if (error.children && error.children.length > 0) {
        const childErrors = this.formatErrors(error.children, propertyPath);
        Object.assign(formatted, childErrors);
      }
    }

    return formatted;
  }
}
