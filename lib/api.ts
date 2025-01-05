import API from './axios-client'
// Importing the Axios client instance for making API requests

// Defining type for forgot password data
type forgotPasswordType = { email: string }

// Defining type for reset password data
type resetPasswordType = { password: string; verificationCode: string }

// Defining type for login credentials
type LoginType = {
  email: string
  password: string
}

// Defining type for user registration data
type registerType = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Defining type for email verification data
type verifyEmailType = { code: string }

// Defining type for multi-factor authentication (MFA) verification data
type verifyMFAType = { code: string; secretKey: string }

// Defining type for MFA login data
type mfaLoginType = { code: string; email: string }

// Defining type for a single session data structure
type SessionType = {
  _id: string
  userId: string
  userAgent: string
  createdAt: string
  expiresAt: string
  isCurrent: boolean
}

// Defining type for the session response, including a message and an array of sessions
type SessionResponseType = {
  message: string
  sessions: SessionType[]
}

// Defining type for MFA setup response data
export type mfaType = {
  message: string
  secret: string
  qrImageUrl: string
}

// Function for logging in a user
export const loginMutationFn = async (data: LoginType) =>
  await API.post('/auth/login', data)

// Function for registering a new user
export const registerMutationFn = async (data: registerType) =>
  await API.post(`/auth/register`, data)

// Function for verifying a user's email
export const verifyEmailMutationFn = async (data: verifyEmailType) =>
  await API.post(`/auth/verify/email`, data)

// Function for requesting a password reset email
export const forgotPasswordMutationFn = async (data: forgotPasswordType) =>
  await API.post(`/auth/forgot/password`, data)

// Function for resetting a user's password using a verification code
export const resetPasswordMutationFn = async (data: resetPasswordType) =>
  await API.post(`/auth/password/reset`, data)

// Function for verifying MFA during login
export const verifyMFALoginMutationFn = async (data: mfaLoginType) =>
  await API.post(`/mfa/verify-login`, data)

// Function for logging out the current user
export const logoutMutationFn = async () => await API.post(`/auth/logout`)

// Function for setting up MFA for a user
export const mfaSetupQueryFn = async () => {
  const response = await API.get<mfaType>(`/mfa/setup`)
  return response.data
}

// Function for verifying the MFA setup
export const verifyMFAMutationFn = async (data: verifyMFAType) =>
  await API.post(`/mfa/verify`, data)

// Function for revoking MFA for a user
export const revokeMFAMutationFn = async () => await API.put(`/mfa/revoke`, {})

// Function for retrieving the current user session data
export const getUserSessionQueryFn = async () => await API.get(`/session/`)

// Function for retrieving all user sessions
export const sessionsQueryFn = async () => {
  const response = await API.get<SessionResponseType>(`/session/all`)
  return response.data
}

// Function for deleting a specific session by its ID
export const sessionDelMutationFn = async (id: string) =>
  await API.delete(`/session/${id}`)

// Summary:
// This code provides a comprehensive set of API utility functions to manage user authentication, sessions, and multi-factor authentication (MFA).
// It includes functions for login, registration, email verification, password reset, MFA setup and verification, session retrieval, and deletion.
// Strongly typed structures ensure data consistency across all operations.
