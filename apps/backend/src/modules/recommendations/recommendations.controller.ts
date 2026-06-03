import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Recommendations')
@UseGuards(JwtAuthGuard)
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get personalized course recommendations for current user' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of recommendations' })
  @ApiResponse({ status: 200, description: 'Recommendations retrieved' })
  async getRecommendations(
    @CurrentUser() user: { sub: string },
    @Query('limit') limit?: string,
  ) {
    const data = await this.recommendationsService.getRecommendations(
      user.sub,
      limit ? parseInt(limit, 10) : 10,
    );
    return { success: true, message: 'Recommendations retrieved successfully', data };
  }

  @Get('course/:courseId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get similar courses to a given course' })
  @ApiParam({ name: 'courseId', type: String, description: 'Course ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of similar courses' })
  @ApiResponse({ status: 200, description: 'Similar courses retrieved' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async getSimilarCourses(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Query('limit') limit?: string,
  ) {
    const data = await this.recommendationsService.getSimilarCourses(
      courseId,
      limit ? parseInt(limit, 10) : 10,
    );
    return { success: true, message: 'Similar courses retrieved successfully', data };
  }
}
