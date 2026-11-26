
import request from "supertest";
import app from "../src/app";

describe("API Integration Tests", () => {
  test("GET /health should return 200 OK", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("OK");
    expect(response.body.error).toBeNull();
  });

  test("GET /unknown should return 404", async () => {
    const response = await request(app).get("/unknown");

    expect(response.status).toBe(404);
  });

  test("POST /api/auth/register should create a user in test database", async () => {
    const email = `test_${Date.now()}@example.com`;

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email,
        password: "Password123",
      });

    expect(response.status).toBe(201);
    expect(response.body.data.user.email).toBe(email);
    expect(response.body.data.token).toBeDefined();
  });

  test("POST /api/auth/register should reject duplicate email", async () => {
    const email = `duplicate_${Date.now()}@example.com`;

    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email,
      password: "Password123",
    });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email,
        password: "Password123",
      });

    expect(response.status).toBe(409);
    expect(response.body.error.message).toBe("Email already registered");
  });
});

describe("AI API Authentication", () => {
  test("POST /api/ai/tickets/1/classify should reject unauthenticated requests", async () => {
    const response = await request(app)
      .post("/api/ai/tickets/1/classify");

    expect(response.status).toBe(401);
    expect(response.body.error.message).toBe(
      "Authentication token required"
    );
  });

  test("POST /api/ai/tickets/1/classify should reject CUSTOMER role", async () => {
    const email = `ai_customer_${Date.now()}@example.com`;

    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "AI Test Customer",
        email,
        password: "Password123",
      });

    const token = registerResponse.body.data.token;

    const response = await request(app)
      .post("/api/ai/tickets/1/classify")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.error.message).toBe("Access forbidden");
  });
});
