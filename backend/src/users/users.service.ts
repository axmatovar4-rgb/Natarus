import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, fullName: true, email: true, phone: true, role: true, isActive: true, createdAt: true },
    });
  }

  async findClients() {
    return this.prisma.user.findMany({
      where: { role: 'CLIENT' },
      select: { id: true, fullName: true, email: true, phone: true },
    });
  }

  async findNotarius() {
    return this.prisma.user.findMany({
      where: { role: 'NOTARIUS' },
      select: { id: true, fullName: true, email: true, phone: true },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, fullName: true, email: true, phone: true, role: true, isActive: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async getProfile(userId: string) {
    return this.findOne(userId);
  }
}
