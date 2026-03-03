import { rateLimit } from 'express-rate-limit';

/** 100 requests per minute per IP — applied globally. */
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

/**
 * 30 write operations per minute per IP — applied to POST / PATCH / DELETE
 * only. Keeping it out of the global middleware ensures GET requests are not
 * inadvertently capped at the lower threshold.
 */
export const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many write requests, please slow down.' },
});
