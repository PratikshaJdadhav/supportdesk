import { readFile } from "node:fs/promises";
import path from "node:path";
import { env } from "../../../config/env";
import type {
  AIProvider,
  AIResult,
  AIUsageCallback,
  TicketContext,
} from "./ai-provider";

export class GeminiProvider implements AIProvider {
  private async getClient() {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const { GoogleGenAI } = await import("@google/genai");
    return new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }

  private async readPrompt(fileName: string): Promise<string> {
    return readFile(
      path.resolve(process.cwd(), "src/ai/prompts", fileName),
      "utf8"
    );
  }

  async *suggestReply(
    ticket: TicketContext,
    onUsage?: AIUsageCallback
  ): AsyncIterable<string> {
    const client = await this.getClient();
    const instructions = await this.readPrompt("suggest-reply.v1.md");

    const stream = await client.models.generateContentStream({
      model: env.GEMINI_MODEL,
      contents: `${instructions}\n\nTicket:\n${JSON.stringify(ticket)}`,
      config: { maxOutputTokens: 300 },
    });

    let inputTokens = 0;
    let outputTokens = 0;
    let totalTokens = 0;

    for await (const chunk of stream) {
      if (chunk.text) yield chunk.text;

      if (chunk.usageMetadata) {
        inputTokens = chunk.usageMetadata.promptTokenCount ?? inputTokens;
        outputTokens = chunk.usageMetadata.candidatesTokenCount ?? outputTokens;
        totalTokens = chunk.usageMetadata.totalTokenCount ?? totalTokens;
      }
    }

    if (totalTokens > 0) {
      onUsage?.({ inputTokens, outputTokens, totalTokens }, env.GEMINI_MODEL);
    }
  }

  async classifyTicket(
    ticket: Pick<TicketContext, "title" | "description">
  ): Promise<AIResult<string>> {
    const client = await this.getClient();
    const instructions = await this.readPrompt("categorize-ticket.v1.md");

    const response = await client.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: `${instructions}\n\nTicket:\n${JSON.stringify(ticket)}`,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 100,
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty classification");
    }

    const usage = response.usageMetadata;

    return {
      data: response.text,
      usage: {
        inputTokens: usage?.promptTokenCount ?? 0,
        outputTokens: usage?.candidatesTokenCount ?? 0,
        totalTokens: usage?.totalTokenCount ?? 0,
      },
      model: env.GEMINI_MODEL,
    };
  }
}
