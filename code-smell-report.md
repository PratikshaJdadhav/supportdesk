# Day 7 – Clean Code and MVC Fundamentals
## SupportDesk Project – Code Smell Review Report

**Project Name:** SupportDesk  
**Task:** Manual and AI Code Review  
**File Reviewed:** `day7-messy-app.js`

---

# Part 1: Manual Code Review

The following code smells were identified during my manual review of the SupportDesk application.

| No. | Code Smell | Evidence / Example | Problem |
|---|---|---|---|
| 1 | Long Function | Ticket creation and update route handlers | Multiple operations are handled inside a single function, making the code difficult to understand. |
| 2 | Duplicate Code | Repeated `Ticket not found` responses | The same error-handling logic is written in multiple routes. |
| 3 | Poor Naming | Short or unclear variable names, where present | Unclear names make the code difficult to read and maintain. |
| 4 | Too Many Responsibilities | Delete ticket route | The route handles ticket lookup, deletion, and response generation together. |

### Manual Review Summary

During the manual review, I identified code that could be improved by separating responsibilities, reducing duplicate logic, and using meaningful variable names.

These are my initial findings. More findings can be added after checking the complete source code.

---

# Part 2: AI Code Review

AI was used to independently review the application and identify additional possible code smells.

| No. | Code Smell | Evidence / Example | Problem |
|---|---|---|---|
| 1 | Long Function | `app.post("/tickets")` | Multiple operations are performed inside one route handler. |
| 2 | Duplicate Code | Repeated `Ticket not found` response | Repeated error-handling logic increases code duplication. |
| 3 | Poor Naming | Unclear variable names, if present | Variable names may not clearly explain their purpose. |
| 4 | Too Many Responsibilities | `app.delete()` route | Lookup, deletion, and response handling are combined. |
| 5 | Business Logic in Route | Ticket creation route | Business logic is directly written inside the route handler. |
| 6 | Direct Data Access | `tickets.push()` | Routes directly modify the ticket array instead of using a separate data-access layer. |
| 7 | Magic Number | `3000` | The port number is hardcoded instead of being configured separately. |
| 8 | Missing Validation | Ticket update route | Input validation should be checked to ensure invalid data is not accepted. |
| 9 | Repeated Logging | Logging statements in multiple routes | Logging can be handled through a common helper where appropriate. |
| 10 | Poor Separation of Concerns | Entire Express application in one file | Routes, business logic, and data handling are not separated into different layers. |

**Note:** These are preliminary AI review findings based on the sample code discussed. Each finding must be verified against the actual source file before final submission.

---

# Part 3: Manual Review vs AI Review Comparison

| Category | Findings |
|---|---|
| Both Found | Long Function, Duplicate Code, Poor Naming, Too Many Responsibilities |
| AI Only | Business Logic in Route, Direct Data Access, Magic Number, Missing Validation, Repeated Logging, Poor Separation of Concerns |
| Me Only | No additional confirmed finding at this stage |
| Disputed / Needs Verification | Variable names, validation, logging, and the exact length of route handlers must be checked in the source code. |

---

# Part 4: Refactoring Plan

The following improvements can be considered after mentor approval:

1. Separate route handlers from business logic.
2. Create controller files to handle request and response operations.
3. Move business logic into service files.
4. Use a separate repository layer for data access.
5. Create reusable error-handling functions.
6. Use meaningful variable and function names.
7. Move the hardcoded port number into an environment configuration.
8. Add appropriate input validation.
9. Avoid unnecessary repeated code.
10. Keep each function responsible for one clear task.



