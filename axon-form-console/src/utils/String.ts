/**
 * Converts a snake_case string to Title Case.
 *
 * Each word separated by underscores is capitalized and joined with spaces.
 *
 * @param input - The snake_case string to convert.
 * @returns The converted Title Case string.
 *
 * @example
 * ```typescript
 * convertSnakeCaseToTitleCase('hello_world'); // "Hello World"
 * ```
 */
export function convertSnakeCaseToTitleCase(input: string): string {
  //
  return input
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param input - The string to capitalize.
 * @returns The string with the first letter capitalized.
 *
 * @example
 * ```typescript
 * capitalize('hello'); // "Hello"
 * ```
 */
export function capitalize(input: string | undefined): string | undefined {
  if (!input) {
    return;
  }

  return input.charAt(0).toUpperCase() + input.slice(1);
}

/**
 * Converts a PascalCase string to a Title Case string with spaces.
 *
 * @param input - The PascalCase string to convert.
 * @returns The converted Title Case string.
 *
 * @example
 * ```typescript
 * convertPascalCaseToTitleCase('HasOptions'); // "Has Options"
 * ```
 */
export function convertPascalCaseToTitleCase(input: string): string {
  return input
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
