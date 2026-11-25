import OpenAI from "openai";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { env } from "../../../config/env";
import type {
  AIProvider,
  AIResult,
  AIUsageCallback,
  TicketContext,
} from "./ai-provider";

export class OpenAIProvider implements AIProvider {
  private getClient(): OpenAI {
    if (!env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    return new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
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
    const client = this.getClient();
    const instructions = await this.readPrompt("suggest-reply.v1.md");

    const stream = await client.responses.create({
      model: env.OPENAI_MODEL,
      instructions,
      input: JSON.stringify(ticket),
      stream: true,
      store: false,
      max_output_tokens: 300,
    });

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        yield event.delta;
      }

      if (event.type === "response.completed") {
        const usage = event.response.usage;

        if (usage) {
          onUsage?.(
            {
              inputTokens: usage.input_tokens,
              outputTokens: usage.output_tokens,
              totalTokens: usage.total_tokens,
            },
            env.OPENAI_MODEL
          );
        }
      }
    }
  }

  async classifyTicket(
    ticket: Pick<TicketContext, "title" | "description">
  ): Promise<AIResult<string>> {
    const client = this.getClient();
    const instructions = await this.readPrompt("categorize-ticket.v1.md");

    const response = await client.responses.create({
      model: env.OPENAI_MODEL,
      instructions,
      input: JSON.stringify(ticket),
      text: {
        format: { type: "json_object" },
      },
      store: false,
      max_output_tokens: 100,
    });

    if (!response.output_text) {
      throw new Error("OpenAI returned an empty classification");
    }

    const usage = response.usage;

    return {
      data: response.output_text,
      usage: {
        inputTokens: usage?.input_tokens ?? 0,
        outputTokens: usage?.output_tokens ?? 0,
        totalTokens: usage?.total_tokens ?? 0,
      },
      model: env.OPENAI_MODEL,
    };
  }
}
