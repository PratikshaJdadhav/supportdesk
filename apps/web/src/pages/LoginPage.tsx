import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  loginUser,
  type LoginCredentials,
} from "../features/auth/api/authApi";
import { useAuth } from "../features/auth/context/AuthContext";
import { Input } from "../components/ui/Input";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();

  async function handleLogin(credentials: LoginCredentials) {
    clearErrors("root.server");

    try {
      const response = await loginUser(credentials);
      login(response.data.user, response.data.token);
      navigate("/");
    } catch (err) {
      setError("root.server", {
        type: "server",
        message: err instanceof Error ? err.message : "Login failed",
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-4">
      <form
        onSubmit={handleSubmit(handleLogin)}
        noValidate
        className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white p-8 shadow-2xl"
      >
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg">
            SD
          </div>
          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Login to your SupportDesk account
          </p>
        </div>

        <Input
          label="Email address"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
          })}
        />


        {errors.root?.server && (
          <p className="text-sm text-red-600">
            {errors.root.server.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 p-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-slate-600">
          New user?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
