/**
 * Asynchronously hashes a given message using the SHA-1 algorithm.
 *
 * @param {string} message - The input string to be hashed.
 * @returns {Promise<string|null>} A promise that resolves to the SHA-1 hash as a hexadecimal string,
 * or null if the hashing fails or the browser does not support the required APIs.
 *
 * Notes:
 * - Uses the Web Crypto API (`window.crypto.subtle`) for secure hashing.
 * - Requires `TextEncoder` to convert the string to a Uint8Array.
 * - If either API is unavailable, logs a warning and returns null.
 * - In case of any runtime error, logs the error and returns null.
 */
async function hashMessage(message) {
  try {
    if (!window.crypto) {
      console.warn('Crypto API not supported in this browser.');
      return null;
    }

    if (!window.crypto.subtle) {
      console.warn('SubtleCrypto not supported in this browser.');
      return null;
    }

    if (typeof TextEncoder === 'undefined') {
      console.warn('TextEncoder not supported in this browser.');
      return null;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    console.error('Failed to hash message:', e);
    return null;
  }
}

/**
 * Retrieves the value of a cookie by name.
 *
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string|null} The decoded cookie value, or null if not found or input is invalid.
 */
function getCookie(name) {
  if (typeof name !== 'string' || !name) {
    console.warn('getCookie: Invalid cookie name.');
    return null;
  }

  try {
    const pattern = new RegExp(
      '(?:^|;\\s*)' +
        encodeURIComponent('banner-message-' + name).replace(
          /[-.+*]/g,
          '\\$&'
        ) +
        '=([^;]*)'
    );
    const match = document.cookie.match(pattern);

    if (!match) {
      return null;
    }

    return decodeURIComponent(match[1]);
  } catch (e) {
    console.error('getCookie: Failed to read cookie:', e);
    return null;
  }
}

/**
 * Sets a cookie with the given name, value, and expiration (in days).
 *
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value to store in the cookie.
 * @param {number} [days=182] - Optional. Number of days until the cookie expires. Defaults to 182.
 *
 * Notes:
 * - The cookie is set with the path `/` to make it accessible across the entire site.
 * - The name and value are URI-encoded to ensure compatibility.
 * - The expiration date is converted to UTC format.
 */
function setBannerCookie(name, value, days = 182) {
  const expiryDate = new Date(Date.now() + days * 864e5);
  const expires = expiryDate.toUTCString();
  document.cookie =
    'banner-message-' +
    encodeURIComponent(name) +
    '=' +
    encodeURIComponent(value) +
    '; expires=' +
    expires +
    '; path=/;';
}

/**
 * Handles the display logic of a custom banner based on its hashed message content.
 *
 * This script runs once the DOM is fully loaded. It performs the following:
 *
 * 1. Selects the banner element, message content, and close button from the DOM.
 * 2. Hashes the banner message using SHA-1.
 * 3. Checks for a cookie named with the hash value:
 *    - If the cookie is "true", hides the banner.
 *    - If no cookie is found, shows the banner.
 * 4. When the close button is clicked:
 *    - Hides the banner.
 *    - Sets a cookie with the hashed message key and value "true" to remember the dismissal.
 */
document.addEventListener('DOMContentLoaded', async () => {
  const bannerElement = document.getElementById('custom-banner');
  const messageElement = document.getElementById('banner-message-wrapper');
  const button = document.getElementById('banner-custom-close-btn');

  if (!messageElement || !bannerElement || !button) return;

  const bannerMessage = messageElement.innerHTML.trim();
  if (!bannerMessage) return;

  const hash = await hashMessage(bannerMessage);
  if (!hash) return;

  const cookieValue = getCookie(hash);

  if (cookieValue === 'true') {
    if (!bannerElement.classList.contains('hidden-element')) {
      bannerElement.classList.add('hidden-element');
    }
    return;
  }

  bannerElement.classList.remove('hidden-element');

  const handleClose = () => {
    bannerElement.classList.add('hidden-element');
    setBannerCookie(hash, 'true');
    button.removeEventListener('click', handleClose);
  };

  button.addEventListener('click', handleClose);
});
