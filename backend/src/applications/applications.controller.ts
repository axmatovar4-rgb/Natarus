import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, Request
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  create(@Body() dto: CreateApplicationDto, @Request() req: any) {
    return this.applicationsService.create(dto, req.user.id, req.user.role);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.applicationsService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.applicationsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @Request() req: any,
  ) {
    return this.applicationsService.updateStatus(id, dto, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.applicationsService.delete(id, req.user.id);
  }
}
