import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('habits')
export class HabitsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.habit.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Post()
  create(@Body() body: { name: string; note?: string }) {
    return this.prisma.habit.create({
      data: { name: body.name, note: body.note },
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { name?: string; note?: string; isActive?: boolean }) {
    return this.prisma.habit.update({ where: { id }, data: body });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.habit.delete({ where: { id } });
  }

  @Get(':id/checkins')
  checkins(@Param('id') habitId: string) {
    return this.prisma.checkin.findMany({
      where: { habitId },
      orderBy: { date: 'desc' },
    });
  }

  @Post(':id/checkins')
  async checkin(@Param('id') habitId: string, @Body() body: { date: string }) {
    const d = new Date(body.date + 'T00:00:00.000Z');
    return this.prisma.checkin.create({ data: { habitId, date: d } });
  }
}