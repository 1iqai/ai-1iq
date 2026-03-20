/**
 * Handles authentication errors and returns a user-friendly message.
 *
 * This function maps both AWS Cognito and Firebase error codes to custom messages.
 * If the error code is recognized, a descriptive message is returned.
 * Otherwise, it falls back to the original error message or a generic message.
 *
 * @function handleError
 * @param {unknown} error - The error object thrown by Cognito, Firebase, or other sources.
 * @returns {{ message: string }} An object containing a user-friendly error message.
 */
export function handleError(error: unknown): { message: string } {
  // AWS Cognito error messages
  const cognitoErrorMessages: Record<string, string> = {
    // Authentication errors
    'NotAuthorizedException': 'Incorrect username or password.',
    'UserNotFoundException': 'No account was found with the provided information. Please check your input or sign up.',
    'UserNotConfirmedException': 'Your account has not been verified. Please check your email for a verification link.',
    'PasswordResetRequiredException': 'You need to reset your password. Please use the forgot password option.',
    'InvalidPasswordException': 'The password does not meet the requirements. It must be at least 8 characters with uppercase, lowercase, numbers, and special characters.',
    'InvalidParameterException': 'Invalid input provided. Please check your information and try again.',
    'CodeMismatchException': 'The verification code is incorrect. Please check and try again.',
    'ExpiredCodeException': 'The verification code has expired. Please request a new one.',
    'LimitExceededException': 'Too many attempts. Please wait a moment and try again.',
    'TooManyRequestsException': 'Too many requests. Please wait a moment and try again.',
    'TooManyFailedAttemptsException': 'Too many failed attempts. Your account has been temporarily locked.',
    'UsernameExistsException': 'An account with this email already exists.',
    'AliasExistsException': 'An account with this email already exists.',
    'CodeDeliveryFailureException': 'Failed to send verification code. Please try again later.',
    'InternalErrorException': 'An internal error occurred. Please try again later.',
    'InvalidLambdaResponseException': 'An error occurred during authentication. Please contact support.',
    'UnexpectedLambdaException': 'An unexpected error occurred. Please try again later.',
    'UserLambdaValidationException': 'User validation failed. Please check your information.',
    'ResourceNotFoundException': 'The requested resource was not found. Please contact support.',
    'MFAMethodNotFoundException': 'No multi-factor authentication method found.',
    'InvalidSmsRoleAccessPolicyException': 'SMS configuration error. Please contact support.',
    'InvalidSmsRoleTrustRelationshipException': 'SMS configuration error. Please contact support.',
    'InvalidEmailRoleAccessPolicyException': 'Email configuration error. Please contact support.',
    'EnableSoftwareTokenMFAException': 'Error enabling MFA. Please try again.',
    'SoftwareTokenMFANotFoundException': 'MFA token not found. Please set up MFA again.',
    'ConcurrentModificationException': 'A concurrent modification error occurred. Please try again.',
    'ForbiddenException': 'This action is not allowed.',
  };

  // Firebase error messages (kept for messaging/storage errors)
  const firebaseErrorMessages: Record<string, string> = {
    "auth/claims-too-large": "The custom user data you're trying to set is too large. Please reduce the amount of information and try again.",
    "auth/email-already-exists": "This email address is already registered. Try logging in or use a different email to sign up",
    "auth/id-token-expired": "Your session has expired. Please sign in again to continue.",
    "auth/id-token-revoked": "Your session has been revoked for security reasons. Please log in again.",
    "auth/insufficient-permission": "The app doesn't have permission to perform this action",
    "auth/internal-error": "Something went wrong on our end. Please try again later or contact support if the issue persists.",
    "auth/invalid-argument": "There seems to be an issue with the data provided. Please check your input and try again.",
    "auth/invalid-claims": "The custom user data provided is not formatted correctly. Please review and try again.",
    "auth/invalid-continue-uri": "The link provided is not valid. Please make sure it's a properly formatted URL.",
    "auth/invalid-creation-time": "The account creation time is not in the correct format. Please use a valid UTC date string.",
    "auth/invalid-credential": "The credentials used are not authorized to perform this action.",
    "auth/invalid-disabled-field": `The value for the "disabled" field must be either true or false. Please correct it and try again.`,
    "auth/invalid-display-name": "The display name must be a non-empty string. Please enter a valid name.",
    "auth/invalid-dynamic-link-domain": "The dynamic link domain is not set up correctly for this project.",
    "auth/invalid-email": "The email address entered is not valid. Please check the format and try again.",
    "auth/invalid-email-verified": "The value for email verification must be either true or false. Please update it accordingly.",
    "auth/invalid-hash-algorithm": "The hashing algorithm provided is not supported. Please use one from the list of accepted algorithms.",
    "auth/invalid-hash-block-size": "The block size for the hash must be a valid number. Please check and update the value.",
    "auth/invalid-hash-derived-key-length": "The derived key length must be a valid number. Please verify the input and try again.",
    "auth/invalid-hash-key": "The hash key must be a valid byte buffer. Please ensure it's correctly formatted.",
    "auth/invalid-hash-memory-cost": "The memory cost for hashing must be a valid number. Please adjust the value accordingly.",
    "auth/invalid-hash-parallelization": "The parallelization value must be a valid number. Please check and correct it.",
    "auth/invalid-hash-rounds": "The number of hash rounds must be a valid number. Please provide a correct value.",
    "auth/invalid-hash-salt-separator": "The salt separator used in the hashing algorithm is not valid. Please provide a correctly formatted byte buffer.",
    "auth/invalid-id-token": "The ID token provided is not valid. Please log in again or check the token format.",
    "auth/invalid-last-sign-in-time": "The last sign-in time must be a valid UTC date string. Please verify the format.",
    "auth/invalid-page-token": "The page token used to list users is invalid. Please provide a valid, non-empty string.",
    "auth/invalid-password": "The password must be at least six characters long. Please choose a stronger password.",
    "auth/invalid-password-hash": "The password hash is not valid. Please ensure it's a properly formatted byte buffer.",
    "auth/invalid-password-salt": "The password salt is not valid. Please provide a correctly formatted byte buffer.",
    "auth/invalid-phone-number": "The phone number entered is not valid. Please use a properly formatted number ",
    "auth/invalid-photo-url": "The photo URL provided is not valid. Please enter a correct and complete URL.",
    "auth/invalid-provider-data": "The provider data must be a valid list of user information objects. Please check the format and try again.",
    "auth/invalid-provider-id": "The provider ID is not supported. Please use a valid identifier like google.com, facebook.com, etc.",
    "auth/invalid-oauth-responsetype": "Only one OAuth response type should be set to true. Please review your configuration and correct it.",
    "auth/invalid-session-cookie-duration": "The session duration must be a valid number between 5 minutes and 2 weeks (in milliseconds). Please adjust the value accordingly.",
    "auth/invalid-uid": "The user ID (UID) must be a non-empty string with no more than 128 characters. Please check and update it.",
    "auth/invalid-user-import": "The user data you're trying to import is not valid. Please review the format and required fields.",
    "auth/maximum-user-count-exceeded": "You've exceeded the maximum number of users allowed for import. Please reduce the batch size and try again.",
    "auth/missing-android-pkg-name": "An Android package name is required if the app must be installed. Please include it in your request.",
    "auth/missing-continue-uri": "A valid redirect URL is missing. Please provide a continue URL to proceed.",
    "auth/missing-hash-algorithm": "To import users with password hashes, you must specify the hashing algorithm and its parameters. Please update your request.",
    "auth/missing-ios-bundle-id": "The iOS Bundle ID is missing. Please include it to proceed with the request.",
    "auth/missing-uid": "A user ID (UID) is required for this operation. Please provide a valid UID.",
    "auth/missing-oauth-client-secret": "The OAuth client secret is required to enable OIDC code flow. Please add it to your configuration.",
    "auth/operation-not-allowed": "This sign-in method is currently disabled.",
    "auth/phone-number-already-exists": "This phone number is already associated with another account. Please use a different number or log in.",
    "auth/project-not-found": "No Project was found for the credentials used. Please verify your project setup and credentials.",
    "auth/reserved-claims": "Some of the custom claims you're trying to set are reserved by Firebase. Please use different claim names.",
    "auth/session-cookie-expired": "Your session has expired. Please sign in again to continue.",
    "auth/session-cookie-revoked": "Your session has been revoked for security reasons. Please log in again.",
    "auth/too-many-requests": "Too many requests have been made in a short period. Please wait a Moment and try again.",
    "auth/uid-already-exists": "This user ID (UID) is already in use. Please use a different UID or update the existing user.",
    "auth/unauthorized-continue-uri": "The redirect URL provided is not authorized.",
    "auth/user-disabled": "This account has been disabled by an administrator. Please contact support for assistance.",
    "auth/user-not-found": "No account was found with the provided information. Please check your input or sign up."
  };

  const errorObject = error as { message?: string; code?: string; name?: string };
  const errorMessage = errorObject.message;
  const errorCode = errorObject.code;
  const errorName = errorObject.name;

  if (!errorMessage && !errorCode && !errorName) {
    return { message: 'An unknown error occurred.' };
  }

  // Check for Cognito error (by name - Cognito errors use 'name' property)
  if (errorName && cognitoErrorMessages[errorName]) {
    return { message: cognitoErrorMessages[errorName] };
  }

  // Check for Cognito error (by code)
  if (errorCode && cognitoErrorMessages[errorCode]) {
    return { message: cognitoErrorMessages[errorCode] };
  }

  // Check for Firebase error code in message
  if (errorMessage) {
    const match = errorMessage.match(/\(auth\/([a-z0-9-]+)\)/);
    const firebaseCode = match ? `auth/${match[1]}` : null;

    if (firebaseCode && firebaseErrorMessages[firebaseCode]) {
      return { message: firebaseErrorMessages[firebaseCode] };
    }
  }

  // Fallback to the original error message
  return {
    message: errorMessage || 'An unknown error occurred.',
  };
}
