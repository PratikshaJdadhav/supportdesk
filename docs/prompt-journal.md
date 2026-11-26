
# Git Prompt Journal

### Entry 1 – Repository Structure
- **Date:** 26 October 2026
- **Task:** Created the required folders.
- **Prompt:** How do I create the repository structure?
- **Summary:** AI explained folder creation commands.
- **Changes:** Removed unnecessary README files.
- **Verification:** Used `find . -not -path './.git/*' -print` to check the folder structure.
- **Learning:** Learned to create and verify folders.
- **Follow-up:** How are empty folders tracked in Git?

### Entry 2 – Git Status and Diff
- **Date:** 26 October 2026
- **Task:** Reviewed Git changes.
- **Prompt:** What is the difference between `git status` and `git diff`?
- **Summary:** AI explained both commands.
- **Changes:** Reviewed the changed files.
- **Verification:** Used `git status` to check file states and `git diff` to review exact changes.
- **Learning:** `git status` shows change status, while `git diff` shows the actual changes.
- **Follow-up:** How can I check for secrets before committing?

### Entry 3 – Merge Conflict
- **Date:** 26 October 2026
- **Task:** Practiced merge conflicts.
- **Prompt:** How do I resolve a merge conflict?
- **Summary:** AI explained conflict resolution.
- **Changes:** Kept both changes and removed conflict markers.
- **Verification:** Checked the file and Git status.
- **Learning:** Learned to resolve merge conflicts.
- **Follow-up:** How do I resolve conflicts in large files?
### Entry 4 – Coding and Testing

- **Date:** 27 October 2026
- **Task:** Created a TypeScript CLI and tested ticket ID generation and CSV-to-JSON conversion.
- **Prompt:** Help me build a TypeScript CLI with ticket ID generation, CSV conversion, input validation, and meaningful Jest tests.
- **Summary:** AI provided code examples, commands, and test suggestions.
- **Useful or Missing:** The response helped me implement the features, but I needed to verify the code and test edge cases.
- **Changes:** Implemented the CLI, CSV conversion, and input validation.
- **Verification:** Ran `npm run build` and `npm test`. The recorded test run showed 2 test suites passed and 11 tests passed.
- **Learning:** Learned to use AI for coding and testing while verifying the results myself.
- **Follow-up:** How can I improve CSV parsing and add more edge-case tests?

### Entry 4 – Step-by-Step Coding

- **Date:** 27 October 2026
- **Goal / Context:** I wanted to create a TypeScript CLI for the SupportDesk project.
- **Prompt Used:** Help me create a TypeScript CLI that generates ticket IDs and converts CSV data into JSON. Explain the code step by step.
- **Useful or Missing:** The AI provided code examples and commands. Some error cases needed more attention.
- **Verification or Changes:** I ran the CLI commands and checked the TypeScript build.
- **Outcome and Improvement:** I learned how to implement CLI features. Next time, I will specify input validation requirements clearly.

### Entry 5 – Writing Unit Tests

- **Date:** 27 October 2026
- **Goal / Context:** I wanted to test ticket ID generation and CSV conversion.
- **Prompt Used:** Write at least eight meaningful Jest tests for ticket ID format, unique IDs, CSV conversion, header mapping, empty input, missing columns, malformed rows, and invalid input.
- **Useful or Missing:** The AI suggested tests for valid and invalid inputs. I needed to ensure all required cases were covered.
- **Verification or Changes:** I ran `npm test`. One recorded run showed 2 test suites passed and 11 tests passed.
- **Outcome and Improvement:** I learned how unit tests check program behaviour. Next time, I will compare every required case against my test list.

### Entry 6 – Debugging and Error Handling

- **Date:** 27 October 2026
- **Goal / Context:** I wanted to identify errors and improve input validation in the TypeScript CLI.
- **Prompt Used:** Review my TypeScript code for bugs, invalid inputs, and edge cases. Explain the issues and suggest fixes without claiming that untested changes work.
- **Useful or Missing:** The AI suggested possible fixes and error-handling improvements. Suggestions still needed to be verified.
- **Verification or Changes:** I ran `npm run build` and reviewed the actual test output.
- **Outcome and Improvement:** I learned to check errors systematically. Next time, I will include exact error messages and relevant code in my prompt.

### Entry 7 – Code Review and Improvement

- **Date:** 27 October 2026
- **Goal / Context:** I wanted to improve code readability and maintainability.
- **Prompt Used:** Review my TypeScript CLI for readability, separation of responsibilities, validation, and maintainability. Suggest small improvements and explain their benefits.
- **Useful or Missing:** The AI helped identify areas to review. I needed to make sure suggestions matched the project requirements.
- **Verification or Changes:** I reviewed the suggested changes against the existing code and project requirements.
- **Outcome and Improvement:** I learned to use AI for code review without accepting every suggestion blindly. Next time, I will ask for focused changes and verify them with tests.
### Entry 8 – Day 13 Frontend Foundations

- **Date:** 18 November 2026
- **Task:** Built the SupportDesk frontend foundation using React, Vite, TypeScript, and Tailwind CSS.
- **Prompt Used:** Help me build the frontend foundation step by step. Create a shared API client, login and register pages, application layout, authentication context, and protected routes using the existing backend.
- **AI Summary:** AI provided implementation guidance, code suggestions, and Git commands.
- **Changes Made:** Created the frontend folder structure, shared API client, environment configuration, login and register pages, application layout, authentication context, and protected routes.
- **Verification:** Login with the actual backend was successful. Dashboard access and logout were checked. `grep` confirmed that the only frontend `fetch()` call is inside the shared API client. `npm run build --prefix apps/web` completed successfully.
- **AI Review:** Reviewed API call placement, environment configuration, Git changes, and build output. Further accessibility and automated test checks are pending.
- **Learning:** Learned how React frontend authentication connects to an existing backend and how protected routes work.
- **Follow-up:** How can I add automated frontend tests and improve accessibility?

### Entry 9 – Day 16 AI Features

- **Date:** 24 November 2026
- **Task:** Implemented the SupportDesk AI backend foundation for reply suggestions and ticket classification.
- **Prompt Used:** Help me implement AI Suggest Reply streaming, AI ticket categorisation and priority prediction, Zod validation, provider abstraction, and unit tests without sending replies automatically.
- **AI Summary:** Implemented a mock AI provider, ticket context retrieval with latest comments, streamed reply suggestions, and structured ticket classification.
- **Changes Made:** Added AI provider interfaces, mock provider, versioned prompt files, Zod classification schema, AI service, AI controller, and authenticated AI routes. Added the optional ticket category field and applied the database migration.
- **Verification:** `npm run build` passed. Full API test suite passed: 11 test suites and 55 tests. AI service tests passed: 4 tests.
- **Limitations:** Live OpenAI integration and real token usage/cost tracking are pending because API credentials and the monthly spend limit have not yet been provided. Mock usage is not reported as real provider usage.
- **Learning:** Learned provider abstraction, streamed AI responses, JSON validation with Zod, and testing AI services using mocks.
- **Follow-up:** Complete live provider integration, usage tracking, authenticated route tests, and frontend AI integration after receiving the required API configuration.

### Entry 10 – Additional AI Tests
- Date: 24 Nov 2026
- Added streaming reply draft test.
- Added AI provider failure test.
- Added usage tracker tests for mock usage exclusion and token-based cost calculation.
- Verification: API build successful; 12 test suites and 61 tests passed.
- Note: Live OpenAI integration and actual provider usage remain pending API credentials and approved budget configuration.

### Entry 11 – Day 16 AI Features Completion
- Date: 24 Nov 2026
- Added Agent-only AI Suggest Reply with streamed draft output.
- Added Agent-only AI ticket categorisation and priority classification.
- Reply drafts require human review; no automatic sending.
- Classification output is validated with Zod before saving.
- Admin and Customer AI controls remain hidden.
- Frontend production build successful.
- API TypeScript build successful.
- Verification: 12 test suites passed; 64 tests passed.
- AI provider remains in mock mode. Live OpenAI integration requires approved credentials.
- AI usage cost remains unpriced until official model pricing is configured.
- Jest reported an open-handle warning after tests completed; follow-up investigation pending.

### Entry 12 – Day 17 AI Guardrails

- Date: 26 November 2026
- Task: Implemented AI security and reliability features.
- Prompt Injection: Added protection against malicious instructions.
- Untrusted Content: Treated ticket data as untrusted input.
- PII Masking: Added email, mobile and Aadhaar masking.
- Zod Validation: Added AI output validation.
- Rate Limiting: Limited AI API requests.
- Timeout: Added timeout handling for Gemini and OpenAI.
- Fallback: Added manual reply fallback when AI is unavailable.
- PII Tests: 4/4 PASS.
- Classification Injection Tests: 10/10 PASS.
- Suggest Reply Injection Tests: 10/10 safe responses.
- AI Evaluation: 20/20 PASS (100% accuracy).
- Jest Tests: 13 suites, 68 tests PASS.
- Build: PASS.
- Documentation: Updated injection-test-report.md.
- Learning: Learned AI security, prompt injection protection, PII masking and output validation.