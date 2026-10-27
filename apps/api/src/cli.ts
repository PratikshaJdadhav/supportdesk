
import { generateTicketId } from "./ticketId";
import { convertCsvToJson } from "./csvToJson";

async function main(): Promise<void> {
  const [, , command, ...args] = process.argv;

  if (command === "ticket-id") {
    const number = Number(args[0]);

    if (!args[0] || !Number.isInteger(number) || number < 1) {
      throw new Error("Usage: npm run cli -- ticket-id <positive-number>");
    }

    console.log(generateTicketId(number));
    return;
  }

  if (command === "csv-to-json") {
    const inputPath = args[0];
    const outputPath = args[1];

    if (!inputPath || !outputPath) {
      throw new Error(
        "Usage: npm run cli -- csv-to-json <input.csv> <output.json>"
      );
    }

    const tickets = await convertCsvToJson(inputPath, outputPath);
    console.log(`Successfully converted ${tickets.length} tickets.`);
    console.log(`JSON saved to: ${outputPath}`);
    return;
  }

  throw new Error(
    "Unknown command. Use 'ticket-id' or 'csv-to-json'."
  );
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unexpected error.";
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
