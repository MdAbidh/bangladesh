import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Reviews')
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review with rating for a course' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 409, description: 'Already reviewed this course' })
  async create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateReviewDto,
  ) {
    const data = await this.reviewsService.create(user.sub, dto);
    return { success: true, message: 'Review created successfully', data };
  }

  @Public()
  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get reviews for a course (public)' })
  @ApiParam({ name: 'courseId', type: String, description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved' })
  async findByCourse(@Param('courseId', ParseUUIDPipe) courseId: string) {
    const data = await this.reviewsService.findByCourse(courseId);
    return { success: true, message: 'Reviews retrieved successfully', data };
  }

  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my reviews' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved' })
  async findMyReviews(@CurrentUser() user: { sub: string }) {
    const data = await this.reviewsService.findByUser(user.sub);
    return { success: true, message: 'My reviews retrieved successfully', data };
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review' })
  @ApiParam({ name: 'id', type: String, description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReviewDto,
    @CurrentUser() user: { sub: string },
  ) {
    const data = await this.reviewsService.update(id, user.sub, dto);
    return { success: true, message: 'Review updated successfully', data };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review' })
  @ApiParam({ name: 'id', type: String, description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    await this.reviewsService.delete(id, user.sub, user.role);
    return { success: true, message: 'Review deleted successfully', data: null };
  }
}
