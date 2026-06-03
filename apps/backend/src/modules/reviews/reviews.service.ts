import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
      select: { id: true, status: true },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existing = await this.reviewsRepository.findByUserAndCourse(userId, dto.courseId);
    if (existing) {
      throw new ConflictException('You have already reviewed this course');
    }

    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: dto.courseId } },
    });
    if (!enrollment) {
      throw new BadRequestException('You must be enrolled in the course to review it');
    }

    const review = await this.reviewsRepository.createWithRating(userId, dto);
    await this.recalculateCourseRating(dto.courseId);
    this.logger.log(`Review created: ${review.id} for course ${dto.courseId}`);

    return review;
  }

  async findByCourse(courseId: string) {
    return this.reviewsRepository.findByCourse(courseId);
  }

  async findByUser(userId: string) {
    return this.reviewsRepository.findByUser(userId);
  }

  async update(id: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.reviewsRepository.findById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const data: any = {};
    if (dto.content !== undefined) data.content = dto.content;
    if (dto.rating !== undefined) {
      if (dto.rating < 1 || dto.rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }
      data.rating = dto.rating;
    }

    const updated = await this.reviewsRepository.update(id, data);
    await this.recalculateCourseRating(review.courseId);
    return updated;
  }

  async delete(id: string, userId: string, userRole: string) {
    const review = await this.reviewsRepository.findById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (userRole !== 'ADMIN' && review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewsRepository.delete(id);
    await this.recalculateCourseRating(review.courseId);
    this.logger.log(`Review deleted: ${id}`);
  }

  private async recalculateCourseRating(courseId: string) {
    const ratingAgg = await this.prisma.courseRating.aggregate({
      where: { courseId },
      _avg: { rating: true },
      _count: true,
    });

    const avgRating = Number(ratingAgg._avg.rating?.toFixed(2) || 0);
    const totalRatings = ratingAgg._count;
    const totalReviews = await this.prisma.courseReview.count({
      where: { courseId, deletedAt: null },
    });

    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        averageRating: avgRating,
        totalRatings,
        totalReviews,
      },
    });
  }
}
