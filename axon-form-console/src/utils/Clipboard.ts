import { toast } from 'sonner';

/**
 * Copies text to the clipboard using the modern Clipboard API with fallback
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(
  text?: string,
): Promise<boolean | undefined> {
  if (!text) {
    return false;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
      return true;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error); // Log the error for debugging
  }
  return false; // Indicate failure if the modern API is not available or an error occurs
}
