
'use server';

/**
 * @fileOverview A service to manage CJ Dropshipping API access tokens.
 * It handles fetching, caching, and refreshing the token automatically.
 */

type Token = {
  accessToken: string;
  expiresAt: number; // Timestamp in milliseconds
};

// In-memory cache for the token. In a distributed environment, you might use a shared cache like Redis.
let cachedToken: Token | null = null;

const API_BASE_URL = 'https://developers.cjdropshipping.com/api2.0/v1';
const TOKEN_LIFESPAN_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetches a new access token from the CJ Dropshipping API.
 * @returns {Promise<Token>} A promise that resolves to the new token object.
 */
async function fetchNewToken(): Promise<Token> {
  const apiKey = process.env.CJ_DROPSHIPPING_API_KEY;
  if (!apiKey) {
    throw new Error('CJ Dropshipping API key is not configured in .env file.');
  }

  console.log('Fetching new CJ Dropshipping access token...');

  const response = await fetch(`${API_BASE_URL}/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to get CJ access token: ${response.status} - ${errorBody}`
    );
  }

  const result = await response.json();
  if (!result.result || !result.data?.accessToken) {
    throw new Error(
      result.message || 'Failed to parse access token from CJ API response.'
    );
  }

  const newToken: Token = {
    accessToken: result.data.accessToken,
    expiresAt: Date.now() + TOKEN_LIFESPAN_MS,
  };

  cachedToken = newToken;
  console.log('Successfully fetched and cached new CJ access token.');
  return newToken;
}

/**
 * Retrieves a valid access token, fetching a new one if necessary.
 * @returns {Promise<string>} A promise that resolves to a valid access token string.
 */
export async function getAccessToken(): Promise<string> {
  // Check if token exists and is not expired (with a 1-minute buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.accessToken;
  }

  // If token is invalid or expired, fetch a new one
  const token = await fetchNewToken();
  return token.accessToken;
}
