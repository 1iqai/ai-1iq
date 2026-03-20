import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  completeNewPassword,
  hasPendingPasswordChange,
  clearPendingPasswordChange,
} from "../../utility/utils";
import { handleError } from "../../utility/errorHandler";
import { useAuth } from "../../hooks/useAuth";
import { LoadingIcon } from "../../components/Icons/LoadingIcon";
import { LockIcon } from "../../components/Icons/LockIcon";
import Logo from "../../components/Logo/Logo";

const SetNewPassword: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useAuth();

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Check if there's a pending password change session
  useEffect(() => {
    if (!hasPendingPasswordChange()) {
      // No pending session, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const getRedirectPath = (role: string) => {
    switch (role) {
      case "Project Manager":
        return "/analyticsDashboard";
      case "Admin":
        return "/admindashboard";
      case "Super Admin":
        return "/super-admin/dashboard";
      default:
        return "/login";
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
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

      // Complete the new password challenge
      const user = await completeNewPassword(newPassword);

      setMessage("Password set successfully! Redirecting...");
      setUser(user);
      setIsLoggedIn(true);

      const redirectPath = getRedirectPath(user.role);
      setTimeout(() => {
        navigate(redirectPath);
      }, 1500);
    } catch (err) {
      setError(handleError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    clearPendingPasswordChange();
    navigate("/login");
  };

  const blockSpaceKey: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const stripSpacesOnPaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\s+/g, "");
    const target = e.target as HTMLInputElement;
    const setter = target.name === "newPassword" ? setNewPassword : setConfirmPassword;
    setter(text);
  };

  const sanitizeOnChange =
    (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value.replace(/\s+/g, ""));
    };

  return (
    <div className="min-h-full flex flex-col justify-center items-center px-4 py-10 sm:px-6 bg-[var(--bg-primary-light)] dark:bg-[var(--bg-primary-dark)]">
      <div className="w-full max-w-md sm:max-w-lg bg-[var(--bg-primary-light)] dark:bg-[var(--bg-primary-dark)] border border-[var(--bg-accent-light)] dark:border-[var(--bg-accent-dark)] rounded-3xl shadow-xl p-6 sm:p-8 transition-all">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--heading-primary-light)] dark:text-[var(--heading-primary-dark)] text-center mb-2">
          Set Your Password
        </h2>

        <p className="text-center text-sm text-[var(--txt-muted-light)] dark:text-[var(--txt-muted-dark)] mb-6">
          This is your first time logging in. Please set a new password to continue.
        </p>

        <form className="space-y-4" onSubmit={handlePasswordChange}>
          {/* New Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--txt-primary-light)] dark:text-[var(--txt-primary-dark)]">
              New Password:
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <LockIcon className="text-[var(--txt-muted-light)] dark:text-[var(--txt-muted-dark)]" />
              </span>
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                placeholder="Enter new password"
                onChange={sanitizeOnChange(setNewPassword)}
                onKeyDown={blockSpaceKey}
                onPaste={stripSpacesOnPaste}
                required
                minLength={8}
                maxLength={32}
                className="w-full pl-[2.75rem] pr-16 py-2.5 rounded-full border border-[var(--bg-accent-light)] dark:border-[var(--bg-accent-dark)] bg-[var(--bg-secondary-light)] dark:bg-[var(--bg-secondary-dark)] text-sm text-[var(--txt-primary-light)] dark:text-[var(--txt-primary-dark)] placeholder-[var(--txt-muted-light)] dark:placeholder-[var(--txt-muted-dark)] focus:ring-2 focus:ring-brand-secondary-500 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-[var(--interactive-primary-light)] hover:underline"
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--txt-primary-light)] dark:text-[var(--txt-primary-dark)]">
              Confirm Password:
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <LockIcon className="text-[var(--txt-muted-light)] dark:text-[var(--txt-muted-dark)]" />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm new password"
                onChange={sanitizeOnChange(setConfirmPassword)}
                onKeyDown={blockSpaceKey}
                onPaste={stripSpacesOnPaste}
                required
                minLength={8}
                maxLength={32}
                className="w-full pl-[2.75rem] pr-16 py-2.5 rounded-full border border-[var(--bg-accent-light)] dark:border-[var(--bg-accent-dark)] bg-[var(--bg-secondary-light)] dark:bg-[var(--bg-secondary-dark)] text-sm text-[var(--txt-primary-light)] dark:text-[var(--txt-primary-dark)] placeholder-[var(--txt-muted-light)] dark:placeholder-[var(--txt-muted-dark)] focus:ring-2 focus:ring-brand-secondary-500 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-[var(--interactive-primary-light)] hover:underline"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="text-xs text-[var(--txt-muted-light)] dark:text-[var(--txt-muted-dark)] bg-[var(--bg-secondary-light)] dark:bg-[var(--bg-secondary-dark)] p-3 rounded-lg">
            <p className="font-medium mb-1">Password requirements:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains at least one number</li>
              <li>Contains at least one special character</li>
            </ul>
          </div>

          {/* Message & Error Display */}
          {message && (
            <p className="mt-4 text-center text-sm text-success bg-success/10 border border-success/30 rounded-full px-4 py-2">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-4 text-center text-sm text-error bg-error/10 border border-error/30 rounded-full px-4 py-2">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 text-white font-medium text-sm shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-150 active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingIcon />
                Setting Password...
              </span>
            ) : (
              "Set Password & Continue"
            )}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-2.5 text-sm text-[var(--txt-muted-light)] dark:text-[var(--txt-muted-dark)] hover:text-[var(--txt-primary-light)] dark:hover:text-[var(--txt-primary-dark)] transition-colors"
          >
            Cancel and return to login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetNewPassword;
