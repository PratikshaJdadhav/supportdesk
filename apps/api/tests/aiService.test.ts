import { aiService } from "../src/ai/ai-service";
import { MockAIProvider } from "../src/ai/providers/mock-ai-provider";
import { ticketRepository } from "../src/repositories/ticketRepository";
import { commentRepository } from "../src/repositories/commentRepository";

jest.mock("../src/repositories/ticketRepository", () => ({
  ticketRepository: {
    findById: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock("../src/repositories/commentRepository", () => ({
  commentRepository: {
    findLatestByTicketId: jest.fn(),
  },
}));


const MockProvider = MockAIProvider as jest.MockedClass<typeof MockAIProvider>;

describe("AI Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.restoreAllMocks();
  });

  it("loads ticket context with latest comments", async () => {
    (ticketRepository.findById as jest.Mock).mockResolvedValue({
      title: "Login Issue",
      description: "Unable to login",
    });

    (commentRepository.findLatestByTicketId as jest.Mock).mockResolvedValue([
      { message: "First comment" },
      { message: "Latest comment" },
    ]);

    await expect(aiService.getTicketContext(1)).resolves.toEqual({
      title: "Login Issue",
      description: "Unable to login",
      comments: ["First comment", "Latest comment"],
    });
  });

  it("classifies ticket and updates it after validation", async () => {
    (ticketRepository.findById as jest.Mock).mockResolvedValue({
      title: "Login Issue",
      description: "Unable to login",
    });

    jest.spyOn(MockAIProvider.prototype, "classifyTicket").mockResolvedValue({
      data: JSON.stringify({
        category: "Account Access",
        priority: "MEDIUM",
      }),
      usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
      model: "mock",
    });

    (ticketRepository.update as jest.Mock).mockResolvedValue({
      id: 1,
      category: "Account Access",
      priority: "MEDIUM",
    });

    const result = await aiService.classifyTicket(1);

    expect(result?.classification).toEqual({
      category: "Account Access",
      priority: "MEDIUM",
    });

    expect(ticketRepository.update).toHaveBeenCalledWith(1, {
      category: "Account Access",
      priority: "MEDIUM",
    });
  });

  it("rejects invalid JSON without updating ticket", async () => {
    (ticketRepository.findById as jest.Mock).mockResolvedValue({
      title: "Login Issue",
      description: "Unable to login",
    });

    jest.spyOn(MockAIProvider.prototype, "classifyTicket").mockResolvedValue({
      data: "{ invalid json",
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      model: "mock",
    });

    await expect(aiService.classifyTicket(1)).rejects.toThrow(
      "AI provider returned invalid JSON"
    );

    expect(ticketRepository.update).not.toHaveBeenCalled();
  });

  it("rejects invalid classification fields without updating ticket", async () => {
    (ticketRepository.findById as jest.Mock).mockResolvedValue({
      title: "Login Issue",
      description: "Unable to login",
    });

    jest.spyOn(MockAIProvider.prototype, "classifyTicket").mockResolvedValue({
      data: JSON.stringify({
        category: "Account Access",
        priority: "URGENT",
      }),
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      model: "mock",
    });

    await expect(aiService.classifyTicket(1)).rejects.toThrow();

    expect(ticketRepository.update).not.toHaveBeenCalled();
  });
});

describe("AI Provider and Streaming", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("streams a reply draft in chunks without sending it", async () => {
    const provider = new MockAIProvider();
    const chunks: string[] = [];

    for await (const chunk of provider.suggestReply({
      title: "Login Issue",
      description: "Unable to login",
      comments: ["Login fails"],
    })) {
      chunks.push(chunk);
    }

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join("")).toContain("Login Issue");
  });

  it("handles provider failure without updating the ticket", async () => {
    (ticketRepository.findById as jest.Mock).mockResolvedValue({
      title: "Login Issue",
      description: "Unable to login",
    });

    jest.spyOn(MockAIProvider.prototype, "classifyTicket")
      .mockRejectedValue(new Error("Provider unavailable"));

    await expect(aiService.classifyTicket(1))
      .rejects.toThrow("Provider unavailable");

    expect(ticketRepository.update).not.toHaveBeenCalled();
  });
});

describe("AI Classification Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects missing priority without updating ticket", async () => {
    (ticketRepository.findById as jest.Mock).mockResolvedValue({
      title: "Login Issue",
      description: "Unable to login",
    });

    jest.spyOn(MockAIProvider.prototype, "classifyTicket").mockResolvedValue({
      data: JSON.stringify({
        category: "Account Access",
      }),
      usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
      model: "mock",
    });

    await expect(aiService.classifyTicket(1)).rejects.toThrow();
    expect(ticketRepository.update).not.toHaveBeenCalled();
  });

  it("rejects unsupported category without updating ticket", async () => {
    (ticketRepository.findById as jest.Mock).mockResolvedValue({
      title: "Login Issue",
      description: "Unable to login",
    });

    jest.spyOn(MockAIProvider.prototype, "classifyTicket").mockResolvedValue({
      data: JSON.stringify({
        category: "Network",
        priority: "HIGH",
      }),
      usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
      model: "mock",
    });

    await expect(aiService.classifyTicket(1)).rejects.toThrow();
    expect(ticketRepository.update).not.toHaveBeenCalled();
  });
});

describe("AI Empty Ticket Context", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when ticket does not exist", async () => {
    (ticketRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(aiService.classifyTicket(999)).resolves.toBeNull();

    expect(ticketRepository.update).not.toHaveBeenCalled();
    expect(MockAIProvider.prototype.classifyTicket).not.toHaveBeenCalled();
  });
});
