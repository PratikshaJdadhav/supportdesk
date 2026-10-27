
import { convertCsvToJson } from "../src/csvToJson";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("convertCsvToJson", () => {
  let tempDir: string;
  let inputPath: string;
  let outputPath: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "supportdesk-"));
    inputPath = join(tempDir, "tickets.csv");
    outputPath = join(tempDir, "tickets.json");
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  test("converts CSV records to JSON", async () => {
    await writeFile(
      inputPath,
      "title,description,priority\nLogin issue,Cannot log in,High\n",
      "utf8"
    );

    const tickets = await convertCsvToJson(inputPath, outputPath);

    expect(tickets).toEqual([
      {
        title: "Login issue",
        description: "Cannot log in",
        priority: "High",
      },
    ]);

    const savedJson = JSON.parse(await readFile(outputPath, "utf8"));
    expect(savedJson).toEqual(tickets);
  });

  test("rejects CSV without required headers", async () => {
    await writeFile(
      inputPath,
      "title,priority\nLogin issue,High\n",
      "utf8"
    );

    await expect(
      convertCsvToJson(inputPath, outputPath)
    ).rejects.toThrow("Missing required CSV column: description");
  });

  test("rejects an empty CSV", async () => {
    await writeFile(inputPath, "", "utf8");

    await expect(
      convertCsvToJson(inputPath, outputPath)
    ).rejects.toThrow();
  });

  test("rejects rows with missing columns", async () => {
    await writeFile(
      inputPath,
      "title,description,priority\nLogin issue,Cannot log in\n",
      "utf8"
    );

    await expect(
      convertCsvToJson(inputPath, outputPath)
    ).rejects.toThrow("Invalid CSV row: 2");
  });

  test("rejects empty required fields", async () => {
    await writeFile(
      inputPath,
      "title,description,priority\n,Cannot log in,High\n",
      "utf8"
    );

    await expect(
      convertCsvToJson(inputPath, outputPath)
    ).rejects.toThrow("Required field is empty in CSV row: 2");
  });
});
