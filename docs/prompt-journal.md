
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