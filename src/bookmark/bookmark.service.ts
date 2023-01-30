import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    return await this.prisma.bookmark.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async getBookmarks(userId: number) {
    return await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    return await this.prisma.bookmark.findMany({
      where: {
        userId,
        id: bookmarkId,
      },
    });
  }

  async deleteBookmark(userId: number, bookmarkId: number) {
    //  get the bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });
    // check if the user is the owner
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to recource denied');
    }
    // delete the bookmark
    return await this.prisma.bookmark.delete({ where: { id: bookmarkId } });
  }

  async editBookmark(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
    // get the bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });
    // check if user is the owner
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to recource denied');
    }
    // edit the bookmark
    return this.prisma.bookmark.update({
      where: { id: bookmarkId },
      data: { ...dto },
    });
  }
}
