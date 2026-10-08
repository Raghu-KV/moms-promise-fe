import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // sends customer_token cookie automatically, same pattern as admin_token in moms-promise-be
  headers: {
    "Content-Type": "application/json",
  },
});

// Normalize every error to the same shape so callers don't each parse response.data.message themselves
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    // Keep the original response on the Error so callers that read
    // err.response.data.message keep working alongside err.message.
    return Promise.reject(Object.assign(new Error(message), { response: error.response }));
  },
);
