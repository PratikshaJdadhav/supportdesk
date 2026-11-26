import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  helperText?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, required, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div>
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>

        <input
          {...props}
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [error ? errorId : null, helperText ? helperId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={`w-full rounded-xl border bg-slate-50 p-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${
            error ? "border-red-500" : "border-slate-200"
          } ${className}`}
        />

        {helperText && (
          <p id={helperId} className="mt-1 text-sm text-slate-500">
            {helperText}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
