import { env } from "../../config/env";
import { MockAIProvider } from "./providers/mock-ai-provider";
import { OpenAIProvider } from "./providers/openai-provider";
import { GeminiProvider } from "./providers/gemini-provider";
import type {
  AIProvider,
  AIUsageCallback,
  TicketContext,
} from "./providers/ai-provider";
import { ticketClassificationSchema } from "./schemas/ticket-ai.schema";
import { ticketRepository } from "../repositories/ticketRepository";
import { commentRepository } from "../repositories/commentRepository";

function createProvider(): AIProvider {
  if (env.AI_PROVIDER === "gemini") {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is required when AI_PROVIDER=gemini");
    }
    return new GeminiProvider();
  }

  if (env.AI_PROVIDER === "openai") {
    if (!env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is required when AI_PROVIDER=openai");
    }
    return new OpenAIProvider();
  }

  return new MockAIProvider();
}

const provider: AIProvider = createProvider();

export const aiService = {
  async getTicketContext(ticketId: number): Promise<TicketContext | null> {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) return null;

    const comments = await commentRepository.findLatestByTicketId(ticketId);

    return {
      title: ticket.title,
      description: ticket.description,
      comments: comments.map((comment) => comment.message),
    };
  },

  async *suggestReply(
    ticket: TicketContext,
    onUsage?: AIUsageCallback
  ) {
    yield* provider.suggestReply(ticket, onUsage);
  },

  async classifyTicket(ticketId: number) {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) return null;

    const result = await provider.classifyTicket({
      title: ticket.title,
      description: ticket.description,
    });

    let parsedOutput: unknown;

    try {
      parsedOutput = JSON.parse(result.data);
    } catch {
      throw new Error("AI provider returned invalid JSON");
    }

    const classification = ticketClassificationSchema.parse(parsedOutput);

    const updatedTicket = await ticketRepository.update(ticketId, {
      category: classification.category,
      priority: classification.priority,
    });

    return {
      classification,
      usage: result.usage,
      model: result.model,
      ticket: updatedTicket,
    };
  },
};
