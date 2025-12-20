/**
 * Annotation module barrel export
 * Provides clean imports for all annotation-related functionality
 */

// Types
export type { Meme, AnnotationData, FetchMemeResult, SubmitAnnotationResult } from './types';

// Services
export { getNextMeme } from './services/meme.service';
export { fetchNextMemeRpc } from './services/meme-rpc.service';
export { submitAnnotation } from './services/annotation.service';
export { initializeUserSession } from './services/user-session.service';
export type { UserSessionResult } from './services/user-session.service';

// Validators
export { validateCaption, sanitizeCaption, MAX_CAPTION_LENGTH, MIN_CAPTION_LENGTH } from './validators/caption';

// Handlers
export { handleMemeFetch } from './handlers/meme-fetch.handler';
export type { MemeFetchResult } from './handlers/meme-fetch.handler';

// Utilities
export { constructMemeImageUrl, isValidStoragePath, MEME_BUCKET_NAME } from './utils/image-url';
export { validateCaptionInput, validateSubmissionData } from './utils/validation.helpers';
export {
  createAuthErrorToast,
  createValidationErrorToast,
  createErrorToast,
  createSuccessToast,
} from './utils/toast.helpers';
export type { ToastConfig } from './utils/toast.helpers';

