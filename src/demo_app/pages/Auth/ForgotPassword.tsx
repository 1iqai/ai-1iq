import React, { useState } from 'react';
import { forgotPassword } from '../../utility/utils'; // adjust path as needed
import { handleError } from '../../utility/errorHandler';
import { useReCaptcha } from '../../hooks/useReCaptcha';
import { MailIcon } from '../../components/Icons/MailIcon';
import { BackButton } from '../../components/Icons/BackButtonIcon';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { getToken } = useReCaptcha();
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    try {
      // Generate reCAPTCHA token
      const recaptchaToken = await getToken('forgot_password');

      if (!recaptchaToken) {
        throw new Error('Unable to verify you are human. Please refresh and try again.');
      }

      await forgotPassword(email, recaptchaToken);
      setMessage('A verification code has been sent to your email.');
      setError('');

      // Navigate to reset page with email after a short delay
      setTimeout(() => {
        navigate(`/reset-forgot-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      setError(handleError(err).message);
    }
  };

  return (
    <>
      <div className="h-full relative flex flex-col justify-center items-center px-4 py-10 sm:px-6 bg-[var(--bg-primary)] dark:bg-[var(--bg-primary)]">
         
        <div className="relative w-full max-w-md sm:max-w-lg bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] border-[var(--bg-accent-light)] dark:border-[var(--bg-accent-dark)] rounded-3xl shadow-xl border p-6 sm:p-8 transition-all">
          <BackButton className="absolute top-4 left-4" onClick={() => navigate(-1)} />
          <div className=' flex flex-row  '>
           
            <div className="flex flex-col w-full justify-center items-center mb-6 text-center">

              <h2 className="text-2xl w-full text-center sm:text-3xl font-bold font-heading text-[var(--heading-primary-light)] dark:text-[var(--heading-primary-dark)]">
                Forgot Password
              </h2>
              <p className="mt-1 text-sm text-[var(--txt-secondary-light)] dark:text-[var(--txt-secondary-dark)]">
                Enter your email to reset your password
              </p>
            </div>
          </div>
          <form onSubmit={handleReset} className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <MailIcon className="text-[var(--txt-muted-light)] dark:text-[var(--txt-muted-dark)]" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-[2.75rem] pr-4 py-2.5 rounded-full border border-[var(--bg-accent-light)] dark:border-[var(--bg-accent-dark)] bg-[var(--bg-secondary-light)] dark:bg-[var(--bg-secondary-dark)] text-sm text-[var(--txt-primary-light)] dark:text-[var(--txt-primary-dark)] placeholder-[var(--txt-muted-light)] dark:placeholder-[var(--txt-muted-dark)] focus:ring-2 focus:ring-brand-secondary-500 focus:outline-none transition"
                placeholder="you@example.com"
              />
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
              className="w-full py-3 rounded-full bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 text-white font-medium text-sm shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-150 active:scale-95"
            >
              Send Reset Email
            </button>
          </form>
        </div>
      </div>

    </>
  );
};

export default ForgotPassword;
