import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Global search across courses, users, and categories' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query' })
  @ApiQuery({ name: 'type', required: false, enum: ['courses', 'users', 'categories', 'all'], description: 'Filter by type' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Search results retrieved' })
  async globalSearch(@Query() query: SearchQueryDto) {
    const data = await this.searchService.globalSearch(query);
    return { success: true, message: 'Search results retrieved successfully', data };
  }

  @Public()
  @Get('courses')
  @ApiOperation({ summary: 'Course-specific search with full-text search' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query' })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Filter by category' })
  @ApiQuery({ name: 'level', required: false, enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS'], description: 'Filter by level' })
  @ApiQuery({ name: 'priceMin', required: false, type: Number, description: 'Minimum price' })
  @ApiQuery({ name: 'priceMax', required: false, type: Number, description: 'Maximum price' })
  @ApiQuery({ name: 'isFree', required: false, type: Boolean, description: 'Filter free courses' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['relevance', 'popularity', 'date', 'rating'], description: 'Sort field' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Course search results' })
  async courseSearch(@Query() query: SearchQueryDto) {
    const result = await this.searchService.courseSearch(query);
    return {
      success: true,
      message: 'Course search results retrieved successfully',
      data: result.items,
      meta: result.meta,
    };
  }
}
