import type {
  AIProvider,
  AIResult,
  TicketContext,
} from "./ai-provider";

export class MockAIProvider implements AIProvider {
  async *suggestReply(ticket: TicketContext): AsyncIterable<string> {
    const reply =
      `Hello, thank you for reporting "${ticket.title}". ` +
      "We understand your concern and are reviewing the issue. " +
      "Could you please share additional details?";

    for (const word of reply.split(" ")) {
      yield `${word} `;
    }
  }

  async classifyTicket(
    ticket: Pick<TicketContext, "title" | "description">
  ): Promise<AIResult<string>> {
    const text = `${ticket.title} ${ticket.description}`.toLowerCase();

    let category = "General";

    if (text.includes("login") || text.includes("password")) {
      category = "Account Access";
    } else if (text.includes("payment") || text.includes("billing")) {
      category = "Billing";
    } else if (text.includes("error") || text.includes("bug")) {
      category = "Technical Issue";
    }

    return {
      data: JSON.stringify({
        category,
        priority: "MEDIUM",
      }),
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      model: "mock",
    };
  }
}
