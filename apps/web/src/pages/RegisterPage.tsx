import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  registerUser,
  type RegisterCredentials,
} from "../features/auth/api/authApi";
import { useAuth } from "../features/auth/context/AuthContext";

function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCredentials>();

  async function handleRegister(credentials: RegisterCredentials) {
    clearErrors("root.server");

    try {
      const response = await registerUser(credentials);
      login(response.data.user, response.data.token);
      navigate("/");
    } catch (err) {
      setError("root.server", {
        type: "server",
        message: err instanceof Error ? err.message : "Registration failed",
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-4">
      <form
        onSubmit={handleSubmit(handleRegister)}
        noValidate
        className="w-full max-w-md space-y-5 rounded-3xl border border-white/10 bg-white p-8 shadow-2xl"
      >
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg">
            SD
          </div>
          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Join SupportDesk and manage your support activity
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Full name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Email address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root?.server && (
          <p className="text-sm text-red-600">{errors.root.server.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 p-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
