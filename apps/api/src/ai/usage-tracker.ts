import type { AIUsage } from "./providers/ai-provider";

export function recordAIUsage(
  model: string,
  usage: AIUsage,
  inputPricePerMillion?: number,
  outputPricePerMillion?: number,
) {
  // Mock usage is not real provider usage and must not be reported as such.
  if (model === "mock") return;

  const cost =
    inputPricePerMillion !== undefined &&
    outputPricePerMillion !== undefined
      ? (usage.inputTokens * inputPricePerMillion +
          usage.outputTokens * outputPricePerMillion) / 1_000_000
      : null;

  console.info("AI usage", {
    model,
    ...usage,
    estimatedCostUSD: cost,
  });
}
