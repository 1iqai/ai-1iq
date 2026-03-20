import React, { useState } from "react";
import { resetPassword } from "../../utility/utils";
import { getCurrentUser } from "../../cognitoConfig";
import { LoadingIcon } from "../../components/Icons/LoadingIcon";
import { handleError } from "../../utility/errorHandler";
import { LockIcon } from "../../components/Icons/LockIcon";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../components/Icons/BackButtonIcon";

const ResetPassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const user = getCurrentUser();
      if (!user) {
        setMessage("No user is currently signed in.");
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setMessage("New passwords do not match.");
        setLoading(false);
        return;
      }

      await resetPassword(currentPassword, newPassword);
      setMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (err) {
      setError(handleError(err).message);
    } finally {
      setLoading(false);
    }
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
    const setter =
      target.name === "currentPassword"
        ? setCurrentPassword
        : target.name === "newPassword"
          ? setNewPassword
          : setConfirmPassword;
    setter(text);
  };

  const sanitizeOnChange =
    (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value.replace(/\s+/g, ""));
    };

  return (
    <>

      <div className="min-h-full flex flex-col justify-center items-center px-4 py-10 sm:px-6 bg-[var(--bg-primary-light)] dark:bg-[var(--bg-primary-dark)]">
        <div className="w-full max-w-md sm:max-w-lg bg-[var(--bg-primary-light)] dark:bg-[var(--bg-primary-dark)] border border-[var(--bg-accent-light)] dark:border-[var(--bg-accent-dark)] rounded-3xl shadow-xl p-6 sm:p-8 transition-all relative">
          {/* Optional Back Button */}
          <BackButton className="absolute top-4 left-4" onClick={() => navigate(-1)} />

          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--heading-primary-light)] dark:text-[var(--heading-primary-dark)] text-center mb-6">
            Change Password
          </h2>

          <form className="space-y-4" onSubmit={handlePasswordChange}>
            {/* Current Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-[var(--txt-primary-light)] dark:text-[var(--txt-primary-dark)]">Current Password:</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  <LockIcon className="text-[var(--txt-muted-light)] dark:text-[var(--txt-muted-dark)]" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  placeholder="Current Password"
                  onChange={sanitizeOnChange(setCurrentPassword)}
                  onKeyDown={blockSpaceKey}
                  onPaste={stripSpacesOnPaste}
                  required
                  minLength={6}
                  maxLength={32}
                  className="w-full pl-[2.75rem] pr-4 py-2.5 rounded-full border border-[var(--bg-accent-light)] dark:border-[var(--bg-accent-dark)] bg-[var(--bg-secondary-light)] dark:bg-[var(--bg-secondary-dark)] text-sm text-[var(--txt-primary-light)] dark:text-[var(--txt-primary-dark)] placeholder-[var(--txt-muted-light)] dark:placeholder-[var(--txt-muted-dark)] focus:ring-2 focus:ring-brand-secondary-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-[var(--interactive-primary-light)] hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-[var(--txt-primary-light)] dark:text-[var(--txt-primary-dark)]">Enter New Password:</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  <LockIcon className="text-[var(--txt-muted-light)] dark:text-[var(--txt-muted-dark)]" />
                </span>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  placeholder="New Password"
                  onChange={sanitizeOnChange(setNewPassword)}
                  onKeyDown={blockSpaceKey}
                  onPaste={stripSpacesOnPaste}
                  required
                  minLength={6}
                  maxLength={32}
                  className="w-full pl-[2.75rem] pr-4 py-2.5 rounded-full border border-[var(--bg-accent-light)] dark:border-[var(--bg-accent-dark)] bg-[var(--bg-secondary-light)] dark:bg-[var(--bg-secondary-dark)] text-sm text-[var(--txt-primary-light)] dark:text-[var(--txt-primary-dark)] placeholder-[var(--txt-muted-light)] dark:placeholder-[var(--txt-muted-dark)] focus:ring-2 focus:ring-brand-secondary-500 focus:outline-none transition"
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
              <label className="block mb-2 text-sm font-medium text-[var(--txt-primary-light)] dark:text-[var(--txt-primary-dark)]">Re-enter New Password:</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  <LockIcon className="text-[var(--txt-muted-light)] dark:text-[var(--txt-muted-dark)]" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  placeholder="Confirm New Password"

                  onChange={sanitizeOnChange(setConfirmPassword)}
                  onKeyDown={blockSpaceKey}
                  onPaste={stripSpacesOnPaste}

                  required
                  minLength={6}
                  maxLength={32}
                  className="w-full pl-[2.75rem] pr-4 py-2.5 rounded-full border border-[var(--bg-accent-light)] dark:border-[var(--bg-accent-dark)] bg-[var(--bg-secondary-light)] dark:bg-[var(--bg-secondary-dark)] text-sm text-[var(--txt-primary-light)] dark:text-[var(--txt-primary-dark)] placeholder-[var(--txt-muted-light)] dark:placeholder-[var(--txt-muted-dark)] focus:ring-2 focus:ring-brand-secondary-500 focus:outline-none transition"
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

            {/* Message & Error Display */}
            {message && (
              <p className="mt-4 text-center text-sm text-success bg-success/10 border border-success/30 rounded-full px-4 py-2 flex items-center gap-2">{message}</p>
            )}
            {error && (
              <p className="mt-4 text-center text-sm text-error bg-error/10 border border-error/30 rounded-full px-4 py-2 flex items-center gap-2">{error}</p>
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
                  Updating Password...
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;