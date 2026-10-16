import axios from "axios";

// In the browser we call the public API address. When Next renders a page on
// the server it can reach the API directly on the same machine, which avoids
// a slow (and sometimes timing-out) round trip out to the internet and back.
// API_INTERNAL_URL is optional — leave it unset and the public URL is used
// everywhere, as before.
const baseURL =
  typeof window === "undefined"
    ? process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
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
