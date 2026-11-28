/**
 * Masks common sensitive personal information before sending
 * ticket content to an AI provider.
 */

export function maskPII(value: string): string {
  return value
    // Email addresses
    .replace(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      "[EMAIL_MASKED]"
    )

    // Aadhaar numbers (12 digits, with optional spaces or hyphens)
    .replace(
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
      "[AADHAAR_MASKED]"
    )

    // Indian mobile numbers, with optional +91 or 91 prefix
    .replace(
      /(?:\+91[\s-]?|91[\s-]?)?[6-9]\d{9}\b/g,
      "[PHONE_MASKED]"
    );
}
