import { Injectable, NotFoundException } from "@nestjs/common";
import { BookmarkRepository } from "@bookmarks/models/bookmarks/bookmark.repository";
import { AddBookmarkCommand } from "./bookmark.commands";
import { BookmarkResponse } from "./bookmark.response";

@Injectable()
export class BookmarkCommands {
  constructor(private bookmarkRepository: BookmarkRepository) {}

  async addBookmark(command: AddBookmarkCommand): Promise<BookmarkResponse> {
    const existing = await this.bookmarkRepository.getOneByMultiple({
      userId: command.currentUser.id,
      mangaId: command.mangaId,
    });
    if (existing) {
      if (command.lastChapterId) {
        existing.lastChapterId = command.lastChapterId;
        existing.updatedBy = command.currentUser?.id;
        const updated = await this.bookmarkRepository.update(existing.id, existing);
        return BookmarkResponse.fromEntity(updated);
      }
      return BookmarkResponse.fromEntity(existing);
    }

    const bookmark = await this.bookmarkRepository.insert({
      userId: command.currentUser.id,
      mangaId: command.mangaId,
      lastChapterId: command.lastChapterId,
      createdBy: command.currentUser?.id,
    } as any);
    return BookmarkResponse.fromEntity(bookmark);
  }

  async removeBookmark(id: string, currentUser: { id: string }): Promise<boolean> {
    const bookmark = await this.bookmarkRepository.getById(id);
    if (!bookmark) throw new NotFoundException("Bookmark not found.");
    if (bookmark.userId !== currentUser.id) {
      throw new NotFoundException("Bookmark not found.");
    }
    return this.bookmarkRepository.delete(id);
  }
}
