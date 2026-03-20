import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { userPool, getCurrentUser } from '../cognitoConfig';
import { permittedRoles } from '../contexts/AuthContext';

// Store for the CognitoUser object when new password is required
let pendingCognitoUser: CognitoUser | null = null;
let pendingUserData: any = null;

/**
 * Retrieves the initial user object from localStorage.
 *
 * @function getInitialUser
 * @returns {object | null} The parsed user object if found, otherwise null.
 */
export const getInitialUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Failed to parse user from localStorage', error);
    return null;
  }
};

/**
 * Creates a new user by sending a POST request to the backend API.
 * Note: User creation in Cognito is handled by the backend.
 *
 * @async
 * @function signUp
 * @param {object} data - The user data for registration.
 * @param {string} data.email - The user's email address.
 * @param {string} data.username - The username.
 * @param {string} data.name - The full name.
 * @param {string} data.password - The password.
 * @param {string} data.roleId - The role identifier.
 * @returns {Promise<any>} A promise that resolves to the backend response.
 *
 * @throws {Error} If the backend request fails.
 */
export const signUp = async (data: any): Promise<any> => {
  try {
    const token = localStorage.getItem('token');

    const body: any = {
      email: data.email.toLowerCase(),
      username: data.username,
      name: data.name,
      password: data.password,
      roleId: data.roleId,
    };

    if (data.organizationId) {
      body.organizationId = data.organizationId;
    }

    if (Array.isArray(data.divisionIds)) {
      body.divisionIds = data.divisionIds;
    }

    const result = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/user/create-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!result.ok) {
      const errorData = await result.json();
      throw new Error(errorData.message || 'Backend user creation failed.');
    }
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Custom error class for new password required scenario.
 * Contains the email for redirect purposes.
 */
export class NewPasswordRequiredError extends Error {
  email: string;

  constructor(email: string) {
    super('NEW_PASSWORD_REQUIRED');
    this.name = 'NewPasswordRequiredError';
    this.email = email;
  }
}

/**
 * Signs in a user using AWS Cognito and validates their role via backend.
 *
 * @async
 * @function signIn
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The user data from the backend.
 *
 * @throws {Error} If the user does not exist, is not permitted, or authentication fails.
 * @throws {NewPasswordRequiredError} If the user needs to set a new password (first-time login).
 */
export const signIn = async (
  email: string,
  password: string,
  recaptchaToken: string
): Promise<any> => {
  // First, check user exists and get role from backend
  const result = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/auth/check-user-exists`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Recaptcha-Token': recaptchaToken,
      },
      body: JSON.stringify({ email: email.toLowerCase() }),
    }
  );
  const data = await result.json();

  if (!result.ok) {
    throw new Error(data.message || 'An unknown error occurred during user check.');
  }

  if (!permittedRoles.includes(data.data.role)) {
    throw new Error('You are not permitted to access the platform');
  }

  // Authenticate with Cognito
  const authenticationDetails = new AuthenticationDetails({
    Username: email.toLowerCase(),
    Password: password,
  });

  const cognitoUser = new CognitoUser({
    Username: email.toLowerCase(),
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: async (session: CognitoUserSession) => {
        const idToken = session.getIdToken().getJwtToken();

        // Request notification permission and save device token
        await requestPermission(idToken);

        // Store tokens
        localStorage.setItem('token', idToken);
        localStorage.setItem('accessToken', session.getAccessToken().getJwtToken());
        localStorage.setItem('refreshToken', session.getRefreshToken().getToken());
        localStorage.setItem('user', JSON.stringify(data.data));

        // Clear any pending user data
        pendingCognitoUser = null;
        pendingUserData = null;

        resolve(data.data);
      },
      onFailure: (err) => {
        reject(err);
      },
      newPasswordRequired: () => {
        // Store the cognito user and user data for the password reset flow
        pendingCognitoUser = cognitoUser;
        pendingUserData = data.data;

        // Reject with a special error that the Login page can handle
        reject(new NewPasswordRequiredError(email.toLowerCase()));
      },
    });
  });
};

/**
 * Completes the new password challenge for first-time login.
 *
 * @async
 * @function completeNewPassword
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<object>} The user data from the backend.
 *
 * @throws {Error} If no pending user session or password change fails.
 */
export const completeNewPassword = async (newPassword: string): Promise<any> => {
  if (!pendingCognitoUser || !pendingUserData) {
    throw new Error('No pending password change session. Please try logging in again.');
  }

  // Pass required attributes for users created without them in Cognito
  const requiredAttributes: Record<string, string> = {};
  if (pendingUserData.name) {
    requiredAttributes.name = pendingUserData.name;
  }
  if (pendingUserData.username) {
    requiredAttributes.preferred_username = pendingUserData.username;
  } else if (pendingUserData.email) {
    // Fallback to email if username is not available
    requiredAttributes.preferred_username = pendingUserData.email;
  }

  return new Promise((resolve, reject) => {
    pendingCognitoUser!.completeNewPasswordChallenge(newPassword, requiredAttributes, {
      onSuccess: async (session: CognitoUserSession) => {
        const idToken = session.getIdToken().getJwtToken();

        // Request notification permission and save device token
        await requestPermission(idToken);

        // Store tokens
        localStorage.setItem('token', idToken);
        localStorage.setItem('accessToken', session.getAccessToken().getJwtToken());
        localStorage.setItem('refreshToken', session.getRefreshToken().getToken());
        localStorage.setItem('user', JSON.stringify(pendingUserData));

        const userData = pendingUserData;

        // Clear pending data
        pendingCognitoUser = null;
        pendingUserData = null;

        resolve(userData);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

/**
 * Checks if there's a pending new password session.
 *
 * @function hasPendingPasswordChange
 * @returns {boolean} True if there's a pending password change session.
 */
export const hasPendingPasswordChange = (): boolean => {
  return pendingCognitoUser !== null && pendingUserData !== null;
};

/**
 * Clears the pending password change session.
 *
 * @function clearPendingPasswordChange
 */
export const clearPendingPasswordChange = (): void => {
  pendingCognitoUser = null;
  pendingUserData = null;
};

/**
 * Sends a password reset code to the user's email via Cognito.
 *
 * @async
 * @function forgotPassword
 * @param {string} email - The user's email address.
 * @returns {Promise<void>} Resolves when the code is sent successfully.
 *
 * @throws {Error} If the user does not exist or the request fails.
 */
export const forgotPassword = async (email: string, recaptchaToken: string): Promise<void> => {
  // First verify user exists in backend
  const result = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/auth/check-user-exists`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Recaptcha-Token': recaptchaToken,
      },
      body: JSON.stringify({ email: email.toLowerCase() }),
    }
  );
  const data = await result.json();

  if (!result.ok) {
    throw new Error(data.message || 'An unknown error occurred during user check.');
  }

  const cognitoUser = new CognitoUser({
    Username: email.toLowerCase(),
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.forgotPassword({
      onSuccess: () => {
        resolve();
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

/**
 * Confirms password reset with the verification code sent to user's email.
 * Now routes through backend for Turnstile verification.
 *
 * @async
 * @function confirmForgotPassword
 * @param {string} email - The user's email address.
 * @param {string} code - The verification code from email.
 * @param {string} newPassword - The new password to set.
 * @param {string} recaptchaToken - The Turnstile token for verification.
 * @returns {Promise<void>} Resolves when the password is reset successfully.
 */
export const confirmForgotPassword = async (
  email: string,
  code: string,
  newPassword: string,
  recaptchaToken: string
): Promise<void> => {
  const result = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/auth/confirm-forgot-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Recaptcha-Token': recaptchaToken,
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        code,
        newPassword,
      }),
    }
  );

  const data = await result.json();

  if (!result.ok) {
    throw new Error(data.message || 'Failed to reset password.');
  }
};

/**
 * Changes the user's password (requires current password for verification).
 *
 * @async
 * @function resetPassword
 * @param {string} currentPassword - The user's current password.
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<void>} Resolves when the password is updated successfully.
 */
export const resetPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const cognitoUser = getCurrentUser();

  if (!cognitoUser) {
    throw new Error('No authenticated user found.');
  }

  return new Promise((resolve, reject) => {
    cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session) {
        reject(new Error('Unable to get user session.'));
        return;
      }

      cognitoUser.changePassword(currentPassword, newPassword, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
};

/**
 * Signs out the current user from Cognito.
 */
export const signOutUser = (): void => {
  const cognitoUser = getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
};

/**
 * Refreshes the Cognito session and returns a new ID token.
 *
 * @async
 * @function refreshSession
 * @returns {Promise<string>} The new ID token.
 */
export const refreshSession = async (): Promise<string> => {
  const cognitoUser = getCurrentUser();

  if (!cognitoUser) {
    throw new Error('No authenticated user found.');
  }

  return new Promise((resolve, reject) => {
    cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err) {
        reject(err);
        return;
      }

      if (!session) {
        reject(new Error('No session found.'));
        return;
      }

      // Check if session is valid
      if (session.isValid()) {
        const idToken = session.getIdToken().getJwtToken();
        localStorage.setItem('token', idToken);
        resolve(idToken);
      } else {
        // Refresh the session
        const refreshToken = session.getRefreshToken();
        cognitoUser.refreshSession(refreshToken, (err, newSession) => {
          if (err) {
            reject(err);
            return;
          }
          const idToken = newSession.getIdToken().getJwtToken();
          localStorage.setItem('token', idToken);
          localStorage.setItem('accessToken', newSession.getAccessToken().getJwtToken());
          resolve(idToken);
        });
      }
    });
  });
};

/**
 * Requests notification permission and saves the device token to the backend.
 * NOTE: Push notifications are currently disabled. This is a stub function.
 * To re-enable, implement an alternative push notification service.
 *
 * @async
 * @function requestPermission
 * @param {string} _token - The Cognito ID token for authentication (unused).
 * @returns {Promise<void>} Resolves immediately (no-op).
 */
export const requestPermission = async (_token: string) => {
  // Push notifications disabled - Firebase removed
  // To re-enable push notifications, implement an alternative service here
  // console.log('Push notifications are currently disabled');
};
