
import { readFile, writeFile } from "node:fs/promises";

export interface Ticket {
  title: string;
  description: string;
  priority: string;
}

export async function convertCsvToJson(
  inputPath: string,
  outputPath: string
): Promise<Ticket[]> {
  const content = await readFile(inputPath, "utf8");
  const lines = content.trim().split(/\r?\n/);

  if (lines.length < 2) {
    throw new Error("CSV must contain a header and at least one ticket.");
  }

  const headers = lines[0].split(",").map((header) => header.trim());
  const requiredHeaders = ["title", "description", "priority"];

  for (const header of requiredHeaders) {
    if (!headers.includes(header)) {
      throw new Error(`Missing required CSV column: ${header}`);
    }
  }

  const tickets: Ticket[] = lines.slice(1).map((line, index) => {
    const values = line.split(",").map((value) => value.trim());

    if (values.length !== headers.length) {
      throw new Error(`Invalid CSV row: ${index + 2}`);
    }

    const record = Object.fromEntries(
      headers.map((header, i) => [header, values[i]])
    );

    const title = record.title;
    const description = record.description;
    const priority = record.priority;

    if (!title || !description || !priority) {
      throw new Error(`Required field is empty in CSV row: ${index + 2}`);
    }

    return { title, description, priority };
  });

  await writeFile(outputPath, JSON.stringify(tickets, null, 2), "utf8");

  return tickets;
}
