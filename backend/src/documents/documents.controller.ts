import {
  Controller, Post, Get, Delete,
  Param, Body, UseGuards, Request,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentType } from '@prisma/client';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('upload/:applicationId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  upload(
    @Param('applicationId') applicationId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') docType: DocumentType,
    @Request() req: any,
  ) {
    return this.documentsService.upload(applicationId, file, docType, req.user.id);
  }

  @Get('application/:applicationId')
  findByApplication(@Param('applicationId') applicationId: string, @Request() req: any) {
    return this.documentsService.findByApplication(applicationId, req.user.id, req.user.role);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.documentsService.delete(id, req.user.id);
  }
}
