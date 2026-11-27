# Week 1 SupportDesk Audit

## Scope
This audit reviews the repository evidence available for Week 1, Days 1–5. It is based only on repository files and repository state that were verified in the project. Missing information is reported as "Not found" and not guessed.

## Repository evidence reviewed
- [README.md](../README.md)
- [docs/prompt-journal.md](prompt-journal.md)
- [apps/api/README.md](../apps/api/README.md)
- [apps/api/package.json](../apps/api/package.json)
- [apps/api/jest.config.cjs](../apps/api/jest.config.cjs)
- [apps/api/tsconfig.json](../apps/api/tsconfig.json)
- [apps/api/src/cli.ts](../apps/api/src/cli.ts)
- [apps/api/src/ticketId.ts](../apps/api/src/ticketId.ts)
- [apps/api/src/csvToJson.ts](../apps/api/src/csvToJson.ts)
- [apps/api/tests/ticketId.test.ts](../apps/api/tests/ticketId.test.ts)
- [apps/api/tests/csvToJson.test.ts](../apps/api/tests/csvToJson.test.ts)
- Git branch and status from repository state
- Git history from recent commits

## Verification notes
- The current branch is `feat/typescript-cli`.
- Git status showed a modified file: [apps/api/tests/ticketId.test.ts](../apps/api/tests/ticketId.test.ts).
- Recent commit history includes:
  - `7774539 docs: add coding prompt journal entries`
  - `5d284b6 feat(api): add TypeScript ticket CLI and CSV conversion`
  - `26b70a2 docs: add Git prompt journal`
  - `995ebff chore(repo): add repository skeleton directories`
  - `431ab20 feat(repo): add initial project structure`

## Day-by-day summary

### Day 1: Onboarding and development environment setup
Status: Not found

Evidence found:
- [README.md](../README.md) is a minimal monorepo root README and does not describe onboarding or environment setup.
- [apps/api/README.md](../apps/api/README.md) documents the API CLI requirements and usage, but not onboarding notes.

Missing items:
- No explicit onboarding checklist.
- No environment setup log.
- No development environment verification notes were found.

### Day 2: SDLC, Agile, user stories, acceptance criteria, and GitHub Projects
Status: Not found

Evidence found:
- [docs/prompt-journal.md](prompt-journal.md) contains entries for Git usage, coding, testing, debugging, and review, but no SDLC or Agile learning notes.
- No project board, user story, acceptance criteria, or GitHub Projects documentation was found in the repository.

Missing items:
- No SDLC learning notes.
- No Agile methodology notes.
- No user stories or acceptance criteria.
- No GitHub Projects or backlog tracking file.

### Day 3: Prompt engineering notes and prompt journal
Status: Verified complete

Evidence found:
- [docs/prompt-journal.md](prompt-journal.md) is a structured prompt journal with dated entries.
- Entries include:
  - "Entry 1 – Repository Structure"
  - "Entry 2 – Git Status and Diff"
  - "Entry 3 – Merge Conflict"
  - "Entry 4 – Coding and Testing"
  - "Entry 5 – Writing Unit Tests"
  - "Entry 6 – Debugging and Error Handling"
  - "Entry 7 – Code Review and Improvement"

This is direct repository evidence of prompt engineering practice and iterative learning.

### Day 4: Git/GitHub workflow, repository structure, and Pull Request
Status: Partially complete

Evidence found:
- Git branch and status show the current branch is `feat/typescript-cli`.
- Repository structure is evident from the project folders and recent commit history.
- [docs/prompt-journal.md](prompt-journal.md) includes learning notes on Git status, diff, and merge conflict resolution.

Missing items:
- No explicit Pull Request record or PR notes were found.
- No GitHub workflow documentation was found.
- No formal repository conventions or collaboration workflow document was found.

### Day 5: Prompting techniques, TypeScript CLI, Jest tests, and debugging notes
Status: Verified complete

Evidence found:
- [docs/prompt-journal.md](prompt-journal.md) includes Day 5-related entries on coding, testing, debugging, and code review.
- [apps/api/src/cli.ts](../apps/api/src/cli.ts) implements a TypeScript CLI with commands for ticket ID generation and CSV conversion.
- [apps/api/src/ticketId.ts](../apps/api/src/ticketId.ts) validates positive integer input and formats IDs as `TICKET-####`.
- [apps/api/src/csvToJson.ts](../apps/api/src/csvToJson.ts) validates CSV headers, row lengths, and empty required values.
- [apps/api/tests/ticketId.test.ts](../apps/api/tests/ticketId.test.ts) covers valid and invalid ticket ID inputs.
- [apps/api/tests/csvToJson.test.ts](../apps/api/tests/csvToJson.test.ts) covers CSV conversion, missing headers, empty CSV, invalid row length, and empty fields.
- [apps/api/package.json](../apps/api/package.json) provides scripts for `npm test`, `npm run build`, and CLI usage.
- [apps/api/jest.config.cjs](../apps/api/jest.config.cjs) configures Jest for TypeScript tests.
- [apps/api/tsconfig.json](../apps/api/tsconfig.json) configures the TypeScript compiler.
- [apps/api/README.md](../apps/api/README.md) documents usage and expected output.

This is explicit evidence that the Day 5 work is present in the repository.

## Audit table

| Day and task | Status | Evidence and exact file paths | Missing items or gaps | Recommended next action |
|---|---|---|---|---|
| Day 1: Onboarding and environment setup | Not found | [README.md](../README.md), [apps/api/README.md](../apps/api/README.md) | No setup log, onboarding record, or environment notes | Add a short onboarding checklist with required tools and setup steps |
| Day 2: SDLC, Agile, user stories, acceptance criteria, GitHub Projects | Not found | [docs/prompt-journal.md](prompt-journal.md) | No SDLC or Agile notes; no user story or acceptance criteria artifacts | Add a brief Agile and user-story learning note |
| Day 3: Prompt engineering notes and prompt journal | Verified complete | [docs/prompt-journal.md](prompt-journal.md) | Could benefit from more explicit prompt-quality reflections | Keep the journal and add a short prompt-quality section |
| Day 4: Git/GitHub workflow, repo structure, PR | Partially complete | Git branch state; recent commit history; [docs/prompt-journal.md](prompt-journal.md) | No PR record or GitHub workflow document | Add a Git/GitHub workflow summary with branch naming and PR expectations |
| Day 5: Prompting techniques, TypeScript CLI, Jest tests, debugging notes | Verified complete | [docs/prompt-journal.md](prompt-journal.md), [apps/api/src/cli.ts](../apps/api/src/cli.ts), [apps/api/src/ticketId.ts](../apps/api/src/ticketId.ts), [apps/api/src/csvToJson.ts](../apps/api/src/csvToJson.ts), [apps/api/tests/ticketId.test.ts](../apps/api/tests/ticketId.test.ts), [apps/api/tests/csvToJson.test.ts](../apps/api/tests/csvToJson.test.ts), [apps/api/package.json](../apps/api/package.json), [apps/api/jest.config.cjs](../apps/api/jest.config.cjs), [apps/api/tsconfig.json](../apps/api/tsconfig.json) | No separate debugging log beyond the journal review notes | Keep the current evidence and optionally add a concise debugging checklist |

## Existing test commands from project configuration
These commands are configured in [apps/api/package.json](../apps/api/package.json) and documented in [apps/api/README.md](../apps/api/README.md):
- `npm test`
- `npm run build`
- `npm run cli -- ticket-id 1`
- `npm run cli -- csv-to-json samples/tickets.csv samples/tickets.json`

These were identified from configuration and documentation only. No tests were run as part of this audit.

## Highest-priority gaps
1. Day 1 onboarding and environment notes are not present.
2. Day 2 SDLC and Agile evidence is not present.
3. GitHub workflow and PR evidence is incomplete.

## Final status summary
- Day 1: Not found
- Day 2: Not found
- Day 3: Verified complete
- Day 4: Partially complete
- Day 5: Verified complete

## Conclusion
The repository has strong evidence for structured prompting, TypeScript CLI delivery, and Jest-based validation for the Day 5 work. It does not contain explicit repository evidence for Day 1 onboarding, Day 2 SDLC/Agile work, or a GitHub PR/workflow artifact. All missing items are marked as "Not found" rather than guessed.
