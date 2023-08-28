// The character limit on ENS names, nicknames and addresses before we truncate
export const TRUNCATED_NAME_CHAR_LIMIT = 11;

// The number of characters to slice from the beginning of an address for truncated format:
// `${TRUNCATED_ADDRESS_START_CHARS}...${TRUNCATED_ADDRESS_END_CHARS}`
export const TRUNCATED_ADDRESS_START_CHARS = 5;

// The number of characters to slice from the end of an address for truncated format:
// `${TRUNCATED_ADDRESS_START_CHARS}...${TRUNCATED_ADDRESS_END_CHARS}`
export const TRUNCATED_ADDRESS_END_CHARS = 4;

/**
 * Shortens an Ethereum address for display, preserving the beginning and end.
 * Returns the given address if it is no longer than 10 characters.
 * Shortened addresses are 13 characters long.
 *
 * Example output: 0xabcd...1234
 *
 * @param {string} address - The address to shorten.
 * @returns {string} The shortened address, or the original if it was no longer
 * than 10 characters.
 */
export function shortenAddress(address = "") {
  if (address.length < TRUNCATED_NAME_CHAR_LIMIT) {
    return address;
  }

  return `${address.slice(0, TRUNCATED_ADDRESS_START_CHARS)}...${address.slice(
    -TRUNCATED_ADDRESS_END_CHARS
  )}`;
}
