import axios from 'axios'

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // Setting the base URL for the API from environment variables
  withCredentials: true,
  // Including credentials (cookies) with requests to protected routes
  timeout: 10000,
  // Setting a timeout of 10 seconds for requests
}

// Initializing the main Axios instance with custom options
const API = axios.create(options)

// Initializing another Axios instance for handling token refresh
export const APIRefresh = axios.create(options)

APIRefresh.interceptors.response.use((response) => response)
// Adding a response interceptor for APIRefresh to return the response as-is

API.interceptors.response.use(
  (response) => {
    return response
    // Returning the response as-is for successful requests
  },
  async (error) => {
    const { data, status } = error.response
    // Destructuring the error response to access data and status
    console.log(data, 'data')
    if (data.errorCode === 'AUTH_TOKEN_NOT_FOUND' && status === 401) {
      // Checking if the error is due to an expired or missing authentication token
      try {
        await APIRefresh.get('/auth/refresh')
        // Attempting to refresh the authentication token
        return APIRefresh(error.config)
        // Retrying the failed request with the refreshed token
      } catch (error) {
        window.location.href = '/'
        // Redirecting to the home page if token refresh fails
      }
    }
    return Promise.reject({
      ...data,
    })
    // Rejecting the promise with the original error data
  }
)

export default API

// Summary: This code sets up two Axios instances for making API requests.
// The main instance (`API`) handles regular requests, while the second (`APIRefresh`) manages token refresh operations.
// An interceptor on `API` handles token expiration by attempting to refresh the token or redirecting the user to the home page if refresh fails.
