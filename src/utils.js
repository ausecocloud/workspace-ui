
export
function action(type, error = false) {
  return (payload, metadata) => ({
    type, payload, error, metadata,
  });
}

/**
 * Pads configured string to the start of the target string
 *
 * @param {string} str Target string
 * @param {number} len Length to pad string to
 * @param {string} pad String to pad with
 */
export function padStart(str, len, pad = ' ') {
  // Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart#Polyfill
  let length = Math.floor(len);

  // String longer than expected length
  if (str.length >= length) {
    return str;
  }

  // Otherwise, repeat pad to at least fill up the remaining characters required
  length -= str.length;
  let padString = pad;
  if (length > pad.length) {
    padString += pad.repeat(length / pad.length);
  }
  return padString.slice(0, length) + str;
}

export
function formatDate(date) {
  const formattedDate = new Date(date);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const string = `${formattedDate.getDate()} ${months[formattedDate.getMonth()]} ${formattedDate.getFullYear()}`;

  return string;
}

/**
 * Formats the time of a given date-time string as H:MM:SS
 *
 * @param {string} date Date-time value as a string
 */
export function formatTime(date) {
  const dateObj = new Date(date);

  return `${dateObj.getHours()}:${padStart(dateObj.getMinutes().toString(), 2, '0')}:${padStart(dateObj.getSeconds().toString(), 2, '0')}`;
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
