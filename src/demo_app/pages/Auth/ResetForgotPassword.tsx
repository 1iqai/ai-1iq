import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmForgotPassword } from "../../utility/utils";
import { LockIcon } from "../../components/Icons/LockIcon";
import { MailIcon } from "../../components/Icons/MailIcon";
import { handleError } from "../../utility/errorHandler";
import { BackButton } from "../../components/Icons/BackButtonIcon";
import { useReCaptcha } from "../../hooks/useReCaptcha";

const ResetForgotPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getToken } = useReCaptcha();

  // Get email from query params (passed from forgot password page)
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState<string>(emailParam);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    if (!verificationCode) {
      setError("Please enter the verification code.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      // Generate Turnstile token
      const recaptchaToken = await getToken('confirm_forgot_password');

      if (!recaptchaToken) {
        throw new Error('Unable to verify you are human. Please refresh and try again.');
      }

      await confirmForgotPassword(email, verificationCode, newPassword, recaptchaToken);
      setMessage("Password has been reset successfully! Redirecting to login...");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(handleError(err).message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full relative flex flex-col justify-center items-center px-4 py-10 sm:px-6 bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)]">
      <div className="relative w-full max-w-md sm:max-w-lg bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] border-[var(--bg-accent-light)] dark:border-[var(--bg-accent-dark)] rounded-3xl shadow-xl border p-6 sm:p-8 transition-all">
        <BackButton className="absolute top-4 left-4" onClick={() => navigate(-1)} />

        <div className="flex flex-col w-full justify-center items-center mb-6 text-center">
          <h2 className="text-2xl w-full text-center sm:text-3xl font-bold font-heading text-[var(--heading-primary-light)] dark:text-[var(--heading-primary-dark)]">
            Reset Your Password
          </h2>
          <p className="mt-1 text-sm text-[var(--txt-secondary-light)] dark:text-[var(--txt-secondary-dark)]">
            Enter the verification code sent to your email
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <MailIcon className="text-[var(--txt-muted-light)] dark:text-[var(--txt-muted-dark)]" />
            </span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-[2.75rem] pr-4 py-2.5 rounded-full border border-[var(--bg-accent-light)] dark:border-[var(--bg-accent-dark)] bg-[var(--bg-secondary-light)] dark:bg-[var(--bg-secondary-dark)] text-sm text-[var(--txt-primary-light)] dark:text-[var(--txt-primary-dark)] placeholder-[var(--txt-muted-light)] dark:placeholder-[var(--txt-muted-dark)] focus:ring-2 focus:ring-brand-secondary-500 focus:outline-none transition"
            />
          </div>

          {/* Verification Code Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              maxLength={6}
              className="w-full px-4 py-2.5 rounded-full border border-[var(--bg-accent-light)] dark:border-[var(--bg-accent-dark)] bg-[var(--bg-secondary-light)] dark:bg-[var(--bg-secondary-dark)] text-sm text-[var(--txt-primary-light)] dark:text-[var(--txt-primary-dark)] placeholder-[var(--txt-muted-light)] dark:placeholder-[var(--txt-muted-dark)] focus:ring-2 focus:ring-brand-secondary-500 focus:outline-none transition text-center tracking-widest"
            />
          </div>

          {/* New Password Input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <LockIcon className="text-[var(--txt-muted-light)] dark:text-[var(--txt-muted-dark)]" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              maxLength={32}
              className="w-full pl-[2.75rem] pr-16 py-2.5 rounded-full border border-[var(--bg-accent-light)] dark:border-[var(--bg-accent-dark)] bg-[var(--bg-secondary-light)] dark:bg-[var(--bg-secondary-dark)] text-sm text-[var(--txt-primary-light)] dark:text-[var(--txt-primary-dark)] placeholder-[var(--txt-muted-light)] dark:placeholder-[var(--txt-muted-dark)] focus:ring-2 focus:ring-brand-secondary-500 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-sm text-brand-secondary-500 hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <LockIcon className="text-[var(--txt-muted-light)] dark:text-[var(--txt-muted-dark)]" />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              maxLength={32}
              className="w-full pl-[2.75rem] pr-16 py-2.5 rounded-full border border-[var(--bg-accent-light)] dark:border-[var(--bg-accent-dark)] bg-[var(--bg-secondary-light)] dark:bg-[var(--bg-secondary-dark)] text-sm text-[var(--txt-primary-light)] dark:text-[var(--txt-primary-dark)] placeholder-[var(--txt-muted-light)] dark:placeholder-[var(--txt-muted-dark)] focus:ring-2 focus:ring-brand-secondary-500 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-sm text-brand-secondary-500 hover:underline"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {message && (
            <p className="text-success text-sm bg-success/10 border border-success/30 rounded-full px-4 py-2 flex items-center gap-2">
              {message}
            </p>
          )}

          {error && (
            <p className="text-error text-sm bg-error/10 border border-error/30 rounded-full px-4 py-2 flex items-center gap-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 text-white font-medium text-sm shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetForgotPassword;
