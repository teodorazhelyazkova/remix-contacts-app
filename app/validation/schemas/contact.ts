import { z } from 'zod';
import {
    AVATAR_MIN_LENGTH,
    MAX_NAME_LENGTH,
    MIN_NAME_LENGTH,
    MIN_TWITTER_LENGTH,
    NAME_REGEX,
    TWITTER_REGEX,
} from '../validation.constants';

export const contactSchema = z.object({
    avatar: z
        .string()
        .url({ message: 'Avatar must be a valid URL' })
        .min(AVATAR_MIN_LENGTH, {
            message: 'Avatar URL must be at least 2 characters long',
        }),
    first: z
        .string()
        .min(MIN_NAME_LENGTH, {
            message: 'First name must be at least 2 characters long',
        })
        .max(MAX_NAME_LENGTH, {
            message: 'First name must be no more than 70 characters long',
        })
        .regex(NAME_REGEX, {
            message: 'First name must only contain letters',
        }),
    last: z
        .string()
        .min(MIN_NAME_LENGTH, {
            message: 'Last name must be at least 2 characters long',
        })
        .max(MAX_NAME_LENGTH, {
            message: 'Last name must be no more than 70 characters long',
        })
        .regex(NAME_REGEX, {
            message: 'Last name must only contain letters',
        }),
    twitter: z
        .string()
        .min(MIN_TWITTER_LENGTH, {
            message: 'Twitter username must be at least 2 characters long',
        })
        .regex(TWITTER_REGEX, {
            message: 'Twitter must be a valid username (up to 15 characters)',
        }),
});
