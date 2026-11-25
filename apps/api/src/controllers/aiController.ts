import type { Request, Response } from "express";
import { env } from "../../config/env";
import { aiService } from "../ai/ai-service";
import { recordAIUsage } from "../ai/usage-tracker";
import type { AIUsage } from "../ai/providers/ai-provider";

function getTicketId(req: Request): number {
  const id = Number(req.params.ticketId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid ticket ID");
  }
  return id;
}

function recordUsage(model: string, usage: AIUsage) {
  recordAIUsage(
    model,
    usage,
    env.AI_INPUT_USD_PER_MILLION,
    env.AI_OUTPUT_USD_PER_MILLION,
  );
}

export const aiController = {
  async suggestReply(req: Request, res: Response) {
    try {
      const ticketId = getTicketId(req);
      const ticket = await aiService.getTicketContext(ticketId);

      if (!ticket) {
        return res.status(404).json({
          data: null,
          error: { message: "Ticket not found" },
          meta: null,
        });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders?.();

      try {
        for await (const chunk of aiService.suggestReply(
          ticket,
          (usage, model) => recordUsage(model, usage),
        )) {
          if (res.destroyed) return;
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        }
        res.write("data: [DONE]\n\n");
        res.end();
      } catch {
        if (!res.destroyed) {
          res.write(
            `data: ${JSON.stringify({ error: "Reply generation interrupted" })}\n\n`,
          );
          res.end();
        }
      }
    } catch (error) {
      if (!res.headersSent) {
        return res.status(400).json({
          data: null,
          error: {
            message: error instanceof Error ? error.message : "Request failed",
          },
          meta: null,
        });
      }
      if (!res.destroyed) res.end();
    }
  },

  async classifyTicket(req: Request, res: Response) {
    try {
      const ticketId = getTicketId(req);
      const result = await aiService.classifyTicket(ticketId);

      if (!result) {
        return res.status(404).json({
          data: null,
          error: { message: "Ticket not found" },
          meta: null,
        });
      }

      recordUsage(result.model, result.usage);

      return res.status(200).json({
        data: result.classification,
        error: null,
        meta: { model: result.model, usage: result.usage },
      });
    } catch (error) {
      return res.status(400).json({
        data: null,
        error: {
          message: error instanceof Error
            ? error.message
            : "Classification failed",
        },
        meta: null,
      });
    }
  },
};
