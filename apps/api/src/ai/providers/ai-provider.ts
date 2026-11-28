export interface TicketContext {
  title: string;
  description: string;
  comments: string[];
}

export interface AIUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export type AIUsageCallback = (
  usage: AIUsage,
  model: string
) => void;

export interface AIResult<T> {
  data: T;
  usage: AIUsage;
  model: string;
}

export interface AIProvider {
  suggestReply(
    ticket: TicketContext,
    onUsage?: AIUsageCallback
  ): AsyncIterable<string>;

  classifyTicket(
    ticket: Pick<TicketContext, "title" | "description">
  ): Promise<AIResult<string>>;
}
