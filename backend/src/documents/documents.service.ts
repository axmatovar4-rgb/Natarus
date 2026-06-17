import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentType } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async upload(
    applicationId: string,
    file: Express.Multer.File,
    docType: DocumentType,
    userId: string,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) throw new NotFoundException('Ariza topilmadi');

    const hasAccess =
      application.notariusId === userId ||
      application.senderId === userId ||
      application.receiverId === userId;

    if (!hasAccess) throw new ForbiddenException('Ruxsat yo\'q');

    const document = await this.prisma.document.create({
      data: {
        applicationId,
        type: docType,
        name: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: userId,
      },
    });

    return document;
  }

  async findByApplication(applicationId: string, userId: string, role: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) throw new NotFoundException('Ariza topilmadi');

    const hasAccess =
      role === 'NOTARIUS'
        ? application.notariusId === userId
        : application.senderId === userId || application.receiverId === userId;

    if (!hasAccess) throw new ForbiddenException('Ruxsat yo\'q');

    return this.prisma.document.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string, userId: string) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) throw new NotFoundException('Hujjat topilmadi');
    if (document.uploadedBy !== userId) throw new ForbiddenException('Faqat o\'zi yuklagan hujjatni o\'chira oladi');

    // Faylni diskdan o'chirish
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await this.prisma.document.delete({ where: { id } });
    return { message: 'Hujjat o\'chirildi' };
  }
}
