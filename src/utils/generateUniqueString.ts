/**
 * The function generates a unique string of a specified length using a custom alphabet.
 * @param {number} [length] - The `length` parameter in the `generateUniqueString` function is an
 * optional parameter that specifies the length of the unique string to be generated. If a value is
 * provided for `length`, the generated string will have that specific length. If `length` is not
 * provided, the default length of
 * @returns A function named `generateUniqueString` is being returned. This function generates a unique
 * string using the `nanoid` library with a custom alphabet "12345asdfgh" and a specified length
 * (default length is 13 if not provided).
 */
import { customAlphabet } from "nanoid";

const generateUniqueString = (length?: number): string => {
  const nanoid = customAlphabet("12345asdfgh", length ?? 13);
  return nanoid();
};

export default generateUniqueString;
