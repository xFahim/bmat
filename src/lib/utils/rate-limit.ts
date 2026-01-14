/**
 * Rate limiting utilities
 * Simple in-memory rate limiter (for production, use Redis or similar)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limit configuration
 */
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60000, // 1 minute
};

/**
 * Rate limit configurations for different endpoints
 */
const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  '/api/admin/upload-meme': {
    maxRequests: 20, // 20 uploads per minute
    windowMs: 60000,
  },
  'annotation': {
    maxRequests: 30, // 30 annotations per minute
    windowMs: 60000,
  },
  'auth': {
    maxRequests: 5, // 5 auth attempts per minute
    windowMs: 60000,
  },
  'default': DEFAULT_CONFIG,
};

/**
 * Cleans up expired rate limit entries
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Checks if a request should be rate limited
 * @param identifier - Unique identifier (e.g., user ID, IP address)
 * @param endpoint - Endpoint identifier for rate limit config
 * @returns Object indicating if request is allowed and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  endpoint: string = 'default'
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  // Clean up expired entries periodically
  if (Math.random() < 0.1) {
    // 10% chance to cleanup on each request
    cleanupExpiredEntries();
  }

  const config = RATE_LIMIT_CONFIGS[endpoint] || DEFAULT_CONFIG;
  const key = `${identifier}:${endpoint}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, newEntry);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Entry exists and is still valid
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Gets client identifier from request
 * @param request - Request object
 * @param userId - Optional user ID
 * @returns Identifier string
 */
export function getClientIdentifier(request: Request, userId?: string): string {
  // Prefer user ID if available (more accurate)
  if (userId) {
    return userId;
  }

  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';

  return ip;
}











