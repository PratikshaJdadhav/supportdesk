import { recordAIUsage } from "../src/ai/usage-tracker";

describe("AI Usage Tracker", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("does not log mock provider usage as real usage", () => {
    const logSpy = jest.spyOn(console, "info").mockImplementation();

    recordAIUsage("mock", {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
    });

    expect(logSpy).not.toHaveBeenCalled();
  });

  it("calculates cost using provider token usage and configured pricing", () => {
    const logSpy = jest.spyOn(console, "info").mockImplementation();

    recordAIUsage(
      "test-model",
      { inputTokens: 1000, outputTokens: 500, totalTokens: 1500 },
      2,
      4,
    );

    expect(logSpy).toHaveBeenCalledWith("AI usage", {
      model: "test-model",
      inputTokens: 1000,
      outputTokens: 500,
      totalTokens: 1500,
      estimatedCostUSD: 0.004,
    });
  });
});
