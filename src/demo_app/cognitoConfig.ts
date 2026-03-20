import { CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: (import.meta.env.VITE_COGNITO_USER_POOL_ID as string) || "us-east-1_dummy",
  ClientId: (import.meta.env.VITE_COGNITO_CLIENT_ID as string) || "dummyclientid",
};

export const userPool = new CognitoUserPool(poolData);

/**
 * Gets the current authenticated Cognito user.
 * @returns The current CognitoUser or null if not authenticated.
 */
export const getCurrentUser = () => {
  return userPool.getCurrentUser();
};

/**
 * Gets the current user session.
 * @returns Promise that resolves to the CognitoUserSession.
 */
export const getSession = (): Promise<CognitoUserSession> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = getCurrentUser();
    if (!cognitoUser) {
      reject(new Error('No user session found'));
      return;
    }
    cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err) {
        reject(err);
        return;
      }
      if (!session) {
        reject(new Error('No session found'));
        return;
      }
      resolve(session);
    });
  });
};
