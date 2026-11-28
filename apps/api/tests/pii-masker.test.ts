import { maskPII } from "../src/ai/pii-masker";

describe("maskPII", () => {
  it("masks email addresses", () => {
    expect(maskPII("Contact test@example.com")).toBe(
      "Contact [EMAIL_MASKED]"
    );
  });

  it("masks Indian mobile numbers", () => {
    expect(maskPII("Call 9876543210")).toBe(
      "Call [PHONE_MASKED]"
    );
  });

  it("masks Aadhaar numbers", () => {
    expect(maskPII("Aadhaar 1234 5678 9012")).toBe(
      "Aadhaar [AADHAAR_MASKED]"
    );
  });

  it("keeps text without PII unchanged", () => {
    expect(maskPII("My laptop is not working")).toBe(
      "My laptop is not working"
    );
  });
});
