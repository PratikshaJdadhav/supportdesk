
import { GeminiProvider } from "../src/ai/providers/gemini-provider";
import { OpenAIProvider } from "../src/ai/providers/openai-provider";
import { MockAIProvider } from "../src/ai/providers/mock-ai-provider";
import { env } from "../config/env";
import { ticketClassificationSchema } from "../src/ai/schemas/ticket-ai.schema";

const tickets = [
  { title: "Cannot login", description: "Password is not accepted.", category: "Account Access" },
  { title: "Forgot password", description: "Password reset link is not working.", category: "Account Access" },
  { title: "Account locked", description: "My account is locked after login attempts.", category: "Account Access" },
  { title: "Change email", description: "I cannot access my account after changing email.", category: "Account Access" },
  { title: "Two factor issue", description: "OTP is not received during login.", category: "Account Access" },

  { title: "Payment failed", description: "My card payment was declined.", category: "Billing" },
  { title: "Invoice request", description: "Please provide my monthly invoice.", category: "Billing" },
  { title: "Double charge", description: "I was charged twice for one purchase.", category: "Billing" },
  { title: "Refund status", description: "I have not received my refund.", category: "Billing" },
  { title: "Wrong billing amount", description: "The invoice shows an incorrect amount.", category: "Billing" },

  { title: "Application crashes", description: "The application closes whenever I open it.", category: "Technical Issue" },
  { title: "Page not loading", description: "The dashboard displays a server error.", category: "Technical Issue" },
  { title: "Upload error", description: "File upload fails with an error message.", category: "Technical Issue" },
  { title: "Slow application", description: "The application takes too long to respond.", category: "Technical Issue" },
  { title: "API error", description: "The API returns a 500 internal server error.", category: "Technical Issue" },

  { title: "Product information", description: "I need general information about your services.", category: "General" },
  { title: "Business hours", description: "What are your customer support hours?", category: "General" },
  { title: "Feature enquiry", description: "Does your service support team collaboration?", category: "General" },
  { title: "Contact information", description: "How can I contact customer support?", category: "General" },
  { title: "Service question", description: "Where can I read more about your service?", category: "General" },
];

async function main() {
  const provider =
    env.AI_PROVIDER === "gemini"
      ? new GeminiProvider()
      : env.AI_PROVIDER === "openai"
        ? new OpenAIProvider()
        : new MockAIProvider();

  let correct = 0;
  let failed = 0;
  const wrong: string[] = [];

  console.log(`AI Evaluation: ${env.AI_PROVIDER}`);
  console.log(`Total labelled tickets: ${tickets.length}`);

  for (let i = 0; i < tickets.length; i++) {
    if (i > 0) {
      await new Promise((resolve) => setTimeout(resolve, 12_000));
    }

    const ticket = tickets[i];

    try {
      const result = await provider.classifyTicket({
        title: ticket.title,
        description: ticket.description,
      });

      const parsed: unknown = JSON.parse(result.data);
      const classification = ticketClassificationSchema.parse(parsed);
      const passed = classification.category === ticket.category;

      if (passed) correct++;
      else {
        wrong.push(
          `${i + 1}. ${ticket.title}: expected ${ticket.category}, got ${classification.category}`
        );
      }

      console.log(
        `${i + 1}. ${ticket.title} | Expected: ${ticket.category} | Predicted: ${classification.category} | ${passed ? "PASS" : "FAIL"}`
      );
    } catch (error) {
      failed++;
      wrong.push(
        `${i + 1}. ${ticket.title}: evaluation failed - ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.log(`${i + 1}. ${ticket.title} | ERROR`);
    }
  }

  const accuracy = (correct / tickets.length) * 100;

  console.log("\n--- Evaluation Summary ---");
  console.log(`Total: ${tickets.length}`);
  console.log(`Correct: ${correct}`);
  console.log(`Failed predictions/errors: ${wrong.length}`);
  console.log(`Execution errors: ${failed}`);
  console.log(`Category accuracy: ${accuracy.toFixed(2)}%`);
  console.log(`Target (80%): ${accuracy >= 80 ? "MET" : "NOT MET"}`);

  if (wrong.length > 0) {
    console.log("\n--- Wrong Predictions / Failure Cases ---");
    wrong.forEach((item) => console.log(item));
  }
}

main().catch((error) => {
  console.error("Evaluation script failed:", error);
  process.exitCode = 1;
});
