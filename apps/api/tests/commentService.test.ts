import { commentService } from "../src/services/commentService";
import { commentRepository } from "../src/repositories/commentRepository";

jest.mock("../src/repositories/commentRepository", () => ({
  commentRepository: {
    create: jest.fn(),
    findByTicketId: jest.fn(),
  },
}));

const repo = commentRepository as jest.Mocked<typeof commentRepository>;

describe("Comment Service", () => {
  beforeEach(() => jest.clearAllMocks());

  test("createComment calls repository", async () => {
    repo.create.mockResolvedValue({ id: 1 } as any);

    await commentService.createComment("Hello", 5, 10);

    expect(repo.create).toHaveBeenCalledWith({
      message: "Hello",
      ticketId: 5,
      userId: 10,
    });
  });

  test("getCommentsByTicketId calls repository", async () => {
    repo.findByTicketId.mockResolvedValue([] as any);

    await commentService.getCommentsByTicketId(5);

    expect(repo.findByTicketId).toHaveBeenCalledWith(5);
  });
});
