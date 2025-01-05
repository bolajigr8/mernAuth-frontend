import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

// Define the configuration options for Axios instances
const options: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Base API URL from environment variables
  withCredentials: true, // Include cookies in requests
  timeout: 10000, // Set timeout for requests
}

// Create Axios instances for main API and refresh logic
const API = axios.create(options)
export const APIRefresh = axios.create(options)

// Define helper functions with proper TypeScript types

/**
 * Get the value of a cookie by its name.
 * @param name - The name of the cookie.
 * @returns The cookie value or undefined if not found.
 */
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
  return undefined
}

/**
 * Set a cookie with the specified options.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param options - Additional options for the cookie.
 */
const setCookie = (
  name: string,
  value: string,
  options: {
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'Lax' | 'Strict' | 'None'
    expires?: Date
  } = {}
): void => {
  let cookieString = `${name}=${value}; Path=/`
  if (options.httpOnly) cookieString += '; HttpOnly' // Note: Cannot be set client-side
  if (options.secure) cookieString += '; Secure'
  if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`
  if (options.expires)
    cookieString += `; Expires=${options.expires.toUTCString()}`
  document.cookie = cookieString
}

// Interceptor for handling token refresh
APIRefresh.interceptors.response.use(
  (response: AxiosResponse) => response, // Return response as-is for successful requests
  (error: AxiosError) => {
    console.error('APIRefresh error:', error)
    return Promise.reject(error) // Reject other errors
  }
)

// Main API instance response interceptor for handling token expiration
API.interceptors.response.use(
  (response: AxiosResponse) => response, // Return successful response
  async (error: AxiosError) => {
    if (!error.response) {
      console.error('Network or unknown error:', error)
      return Promise.reject(error)
    }

    const { data, status } = error.response as {
      data: { errorCode?: string }
      status: number
    }
    console.log(data, 'Error Data')

    // Handle expired or missing token (401)
    if (status === 401 && data?.errorCode === 'AUTH_TOKEN_NOT_FOUND') {
      try {
        const refreshResponse = await APIRefresh.get<{ accessToken: string }>(
          '/auth/refresh'
        )
        const newAccessToken = refreshResponse.data.accessToken

        // Set the refreshed token in cookies
        setCookie('accessToken', newAccessToken, {
          secure: process.env.NODE_ENV === 'production', // Use Secure in production
          sameSite: 'Lax', // SameSite attribute
          expires: new Date(Date.now() + 3600 * 1000), // 1-hour expiry
        })

        // Retry the original request with the new token
        if (error.config) {
          error.config.headers.set('Authorization', `Bearer ${newAccessToken}`)
          return API(error.config)
        }
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError)
        window.location.href = '/' // Redirect to home if refresh fails
      }
    }
    return Promise.reject(error) // Reject the promise for other errors
  }
)

export default API
