import { authService } from "../src/services/authService";
import { authRepository } from "../src/repositories/authRepository";
import bcrypt from "bcrypt";

jest.mock("../src/repositories/authRepository", () => ({
  authRepository: {
    findByEmail: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const repo = authRepository as jest.Mocked<typeof authRepository>;

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("register creates a new user", async () => {
    repo.findByEmail.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
    repo.create.mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      role: "USER",
    } as any);

    const result = await authService.register({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(result.user.email).toBe("test@example.com");
    expect(result.token).toBeTruthy();
    expect(repo.create).toHaveBeenCalled();
  });

  test("register rejects duplicate email", async () => {
    repo.findByEmail.mockResolvedValue({ id: 1 } as any);

    await expect(
      authService.register({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      })
    ).rejects.toThrow("Email already registered");
  });

  test("login succeeds with valid credentials", async () => {
    repo.findByEmail.mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      role: "USER",
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await authService.login({
      email: "test@example.com",
      password: "password123",
    });

    expect(result.user.email).toBe("test@example.com");
    expect(result.token).toBeTruthy();
  });

  test("login rejects unknown email", async () => {
    repo.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({
        email: "wrong@example.com",
        password: "password123",
      })
    ).rejects.toThrow("Invalid email or password");
  });

  test("login rejects incorrect password", async () => {
    repo.findByEmail.mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      role: "USER",
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      authService.login({
        email: "test@example.com",
        password: "wrongpassword",
      })
    ).rejects.toThrow("Invalid email or password");
  });
});