import { commentRepository } from "../repositories/commentRepository";

export const commentService = {
  createComment(
    message: string,
    ticketId: number,
    userId: number
  ) {
    return commentRepository.create({
      message,
      ticketId,
      userId,
    });
  },

  getCommentsByTicketId(ticketId: number) {
    return commentRepository.findByTicketId(ticketId);
  },
};