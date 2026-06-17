import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/create-application.dto';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateApplicationDto, userId: string, userRole: string) {
    const notariusId = userRole === 'NOTARIUS' ? userId : dto.notariusId || userId;
    const senderId   = userRole === 'CLIENT'   ? userId : (dto.senderId || userId);

    const application = await this.prisma.application.create({
      data: {
        title: dto.title,
        description: dto.description,
        propertyType: dto.propertyType,
        notariusId,
        senderId,
        receiverId:      dto.receiverId   || null,
        receiverName:    dto.receiverName || null,
        applicationCode: dto.applicationCode || null,
        accessPassword:  dto.accessPassword  || null,
        property: {
          create: {
            type: dto.propertyType,
            name: dto.propertyName,
            description: dto.propertyDescription,
            address: dto.propertyAddress,
            cadastralNumber: dto.cadastralNumber,
            estimatedValue: dto.estimatedValue,
          },
        },
        history: {
          create: {
            status: ApplicationStatus.DRAFT,
            comment: 'Ariza yaratildi',
            changedBy: userId,
          },
        },
      },
      include: {
        property: true,
        sender: { select: { id: true, fullName: true, email: true, phone: true } },
        receiver: { select: { id: true, fullName: true, email: true, phone: true } },
        notarius: { select: { id: true, fullName: true, email: true } },
        documents: true,
        history: { orderBy: { createdAt: 'desc' } },
      },
    });

    return application;
  }

  async findAll(userId: string, role: string) {
    const where = role === 'NOTARIUS'
      ? { notariusId: userId }
      : { OR: [{ senderId: userId }, { receiverId: userId }] };

    return this.prisma.application.findMany({
      where,
      include: {
        property: true,
        sender: { select: { id: true, fullName: true, email: true } },
        receiver: { select: { id: true, fullName: true, email: true } },
        notarius: { select: { id: true, fullName: true, email: true } },
        documents: true,
        _count: { select: { documents: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        property: true,
        sender: { select: { id: true, fullName: true, email: true, phone: true } },
        receiver: { select: { id: true, fullName: true, email: true, phone: true } },
        notarius: { select: { id: true, fullName: true, email: true } },
        documents: true,
        history: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!application) throw new NotFoundException('Ariza topilmadi');

    const hasAccess =
      role === 'NOTARIUS'
        ? application.notariusId === userId
        : application.senderId === userId || application.receiverId === userId;

    if (!hasAccess) throw new ForbiddenException('Ruxsat yo\'q');

    return application;
  }

  async updateStatus(id: string, dto: UpdateApplicationStatusDto, userId: string) {
    const application = await this.prisma.application.findUnique({ where: { id } });
    if (!application) throw new NotFoundException('Ariza topilmadi');
    if (application.notariusId !== userId) throw new ForbiddenException('Faqat notarius o\'zgartira oladi');

    const updated = await this.prisma.application.update({
      where: { id },
      data: {
        status: dto.status as ApplicationStatus,
        history: {
          create: {
            status: dto.status as ApplicationStatus,
            comment: dto.comment,
            changedBy: userId,
          },
        },
      },
      include: {
        property: true,
        sender: { select: { id: true, fullName: true, email: true } },
        receiver: { select: { id: true, fullName: true, email: true } },
        history: { orderBy: { createdAt: 'desc' } },
      },
    });

    return updated;
  }

  async delete(id: string, userId: string) {
    const application = await this.prisma.application.findUnique({ where: { id } });
    if (!application) throw new NotFoundException('Ariza topilmadi');
    if (application.notariusId !== userId) throw new ForbiddenException('Faqat notarius o\'chira oladi');
    if (application.status !== 'DRAFT') throw new ForbiddenException('Faqat qoralama arizalarni o\'chirish mumkin');

    await this.prisma.application.delete({ where: { id } });
    return { message: 'Ariza o\'chirildi' };
  }
}
