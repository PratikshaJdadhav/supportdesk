# AI Features

## Overview

SupportDesk includes two AI-powered features.

### 1. AI Suggest Reply

Purpose:

- Generate a draft response for support agents.
- Help agents respond faster and more consistently.
- Replies are reviewed by a human before use.

### 2. AI Ticket Classification

Purpose:

- Predict ticket category.
- Predict ticket priority.
- Automatically update ticket metadata.

## User Flow

### AI Suggest Reply

Endpoint:

POST /tickets/:ticketId/suggest-reply

### AI Ticket Classification

Endpoint:

POST /tickets/:ticketId/classify


## Prompt Templates

Location:

src/ai/prompts/

Files:

- suggest-reply.v1.md
- categorize-ticket.v1.md

Prompt Version:

v1


## Guardrails

### Prompt Injection Protection

- Ticket content is treated as untrusted input
- User instructions cannot override system instructions
- Secrets and API keys cannot be revealed
- Privileged actions are blocked

### PII Masking

- Email -> [EMAIL_MASKED]
- Aadhaar -> [AADHAAR_MASKED]
- Phone -> [PHONE_MASKED]

### Access Control

Required Roles:

- AGENT
- ADMIN

### Rate Limiting

20 requests per 15 minutes

### Output Validation

- Zod schema validation
- Invalid JSON rejection


## Error Handling

Handled Errors:

- Invalid ticket ID
- Ticket not found
- Invalid JSON from AI provider
- Classification failure

Manual Fallback:

AI unavailable — reply manually.

## Validation

Categories:

- General
- Account Access
- Billing
- Technical Issue

Priorities:

- LOW
- MEDIUM
- HIGH

Validation:

ticketClassificationSchema.parse()


## Prompt Templates

Location:

src/ai/prompts/

Files:

- suggest-reply.v1.md
- categorize-ticket.v1.md

Prompt Version:

v1


## Evaluation

Dataset:

20 labelled support tickets

Method:

- Compare predicted category against expected category
- Compare predicted priority against expected priority
- Calculate overall accuracy

Known Failure Cases:

- Ambiguous tickets
- Multiple issues in a single ticket
- Insufficient ticket details


## Limitations

- Small evaluation dataset
- AI predictions are probabilistic
- Human review is still required

## Future Improvements

- Larger evaluation dataset
- Confidence scoring
- Additional ticket categories
- Better monitoring and analytics

## Configuration

Supported Providers:

- OpenAI
- Gemini
- Mock AI Provider

Environment Variables:

- AI_PROVIDER
- OPENAI_API_KEY
- GEMINI_API_KEY

Do not commit real API keys or secrets.

