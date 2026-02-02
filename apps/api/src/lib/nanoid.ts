import { customAlphabet } from 'nanoid'

// Only alphanumeric characters (no _ or -)
export const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 7)
