
export
function action(type, error = false) {
  return (payload, metadata) => ({
    type, payload, error, metadata,
  });
}

export
function formatDate(date) {
  const formattedDate = new Date(date);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const string = `${formattedDate.getDate()} ${months[formattedDate.getMonth()]} ${formattedDate.getFullYear()}`;

  return string;
}

/**
 * Generates human readable string representation of given number of bytes
 *
 * @param {number} bytes The number of bytes to generate string representation of
 * @param {boolean} naForZero Whether to display "n/a" for values of 0 (default = true)
 */
export function bytesToSize(bytes, naForZero = true) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return naForZero ? 'n/a' : `0 ${sizes[0]}`;

  // Calculate the exponent
  const exp = Math.log(bytes) / Math.log(1024);

  if (exp < 1) {
    return `${bytes} ${sizes[0]}`;
  }

  // Construct the string representation using the closest available exponent
  const i = (exp >= sizes.length) ? (sizes.length - 1) : Math.floor(exp);
  const x = exp - i;

  return `${(1024 ** x).toFixed(1)} ${sizes[i]}`;
}
