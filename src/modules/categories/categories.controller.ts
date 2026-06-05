import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ListCategoriesQueryDto } from './dto/list-categories-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAvailableForUser(
    @CurrentUser() user: AuthUser,
    @Query() query: ListCategoriesQueryDto,
  ) {
    return this.categoriesService.findAvailableForUser(user.id, query.type);
  }

  @Post()
  createCustom(@CurrentUser() user: AuthUser, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCustom(user.id, dto);
  }

  @Patch(':id')
  updateCustom(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCustom(user.id, id, dto);
  }

  @Delete(':id')
  deleteCustom(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.categoriesService.deleteCustom(user.id, id);
  }
}
