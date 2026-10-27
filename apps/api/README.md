
# SupportDesk API CLI

## Requirements

- Node.js
- npm

## Install dependencies

```bash
npm install
```

## Generate a Ticket ID

```bash
npm run cli -- ticket-id 1
```

Example output:

```text
TICKET-0001
```

Ticket IDs use the format `TICKET-` followed by a number padded to at least four digits.

## Convert CSV to JSON

```bash
npm run cli -- csv-to-json samples/tickets.csv samples/tickets.json
```

### CSV input format

The CSV file must contain these required columns:

```csv
title,description,priority
Login issue,Cannot log in,High
Payment issue,Payment failed,Medium
Profile issue,Unable to update profile,Low
```

The converter validates required headers, row lengths, and empty required fields. It reports errors for invalid input.

This basic CSV format does not support commas inside quoted field values.

## Run tests

```bash
npm test
```

## Build TypeScript

```bash
npm run build
```

Sample data only; do not use real personal information or secrets.
