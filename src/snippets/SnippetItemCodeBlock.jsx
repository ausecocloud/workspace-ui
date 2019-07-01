import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

/**
 * Generates code snippet text for a given data URL
 *
 * @param {string} language Target language to generate snippet for
 * @param {string} url URL of source data for snippet
 * @param {string} filename Filename for downloaded file in snippet
 * @param {string} [publisher] Publisher of source data
 * @param {string} [contact] Contact point (e.g. email address) for source data
 * @param {string} [license] License governing use of source data
 * @param {string} [landingPage] URL to landing page related to source data
 */
function generateSnippetText(
  language,
  url,
  filename,
  publisher,
  contact,
  license,
  landingPage,
) {
  const commentBlockContents = [
    publisher && `Publisher: ${publisher}`,
    contact && `Contact point: ${contact}`,
    license && `License: ${license}`,
    landingPage && `Full page: ${landingPage}`,
  ].filter(line => line); // Removes lines which we don't have any info for

  /**
   * @param {string} linePrefix
   */
  function getCommentBlock(linePrefix) {
    return `${commentBlockContents
      .map(line => `${linePrefix} ${line}`)
      .join('\n')} \n`;
  }

  switch (language) {
    case 'Python':
      return `${getCommentBlock('#')}
import urllib.request
url = '${url.replace(/'/g, "\\'")}'
filename = '${filename}'
urllib.request.urlretrieve(url, filename)`;

    case 'R':
      return `${getCommentBlock('#')}
url <- "${url.replace(/"/g, '\\"')}"
filename <- "${filename}"
download.file(url, destfile=filename)`;

    case 'Bash':
      return `${getCommentBlock('#')}
curl -LO ${url}`;

    case 'Web Access':
      return `${getCommentBlock('#')}
${url}`;

    default:
      throw new Error(`Language "${language}" not supported`);
  }
}

/**
 * Selects all text within target element
 *
 * @param {Element} element Target element to select text within
 */
function selectElementText(element) {
  // Go over the selection range
  const range = document.createRange();
  range.selectNodeContents(element);

  // Apply selection to the window
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  return selection;
}

/**
 * Generates Promise around handler for copying text to the clipboard
 *
 * @param {string} text Text to copy to clipboard (not guaranteed; see
 *        `copyTextToClipboard()`)
 *
 * @returns {Promise}
 */
function generateClipboardCopyPromise(text) {
  // Detect whether we can use the latest Clipboard API methods
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  // Use old `execCommand` based API
  // NOTE: Requires active selection in the window
  return new Promise((resolve, reject) => {
    const success = document.execCommand('copy');
    if (success) {
      resolve();
    } else {
      reject();
    }
  });
}

/**
 * Copies text to clipboard
 *
 * Note that this will attempt to first use the Clipboard API with given text,
 * otherwise will fire a copy event which will only copy the last selected
 * text within the document.
 *
 * @param {string} text Text to copy to clipboard (not guaranteed; see notes)
 */
function copyTextToClipboard(text) {
  const textCopyPromise = generateClipboardCopyPromise(text);

  return textCopyPromise.catch(() => {
    // Alert when copy failed
    alert('Text was not copied; please copy manually');
  });
}

export class SnippetItemCodeBlock extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,

    publisher: PropTypes.string,
    contactPoint: PropTypes.string,
    landingPage: PropTypes.string,
    license: PropTypes.string,
  };

  static defaultProps = {
    publisher: undefined,
    contactPoint: undefined,
    landingPage: undefined,
    license: undefined,
  };

  render() {
    const {
      url,
      language,
      filename,
      publisher,
      contactPoint,
      landingPage,
      license,
    } = this.props;

    const snippetText = generateSnippetText(
      language,
      url,
      filename,
      publisher,
      contactPoint,
      license,
      landingPage,
    );

    // Creating a reference so that the actual <code> element may be
    // referred to for copying text
    const snippetTextElementRef = React.createRef();

    return (
      <div key={language}>
        <div>
          {language}
          <button
            type="button"
            className="float-right source"
            onClick={(e) => {
              selectElementText(snippetTextElementRef.current);
              copyTextToClipboard(snippetText);
              e.preventDefault();
            }}
          >
            {' '}
            Copy to Clipboard <FontAwesomeIcon icon={faCopy} />
          </button>
        </div>

        <div>
          <code ref={snippetTextElementRef}>{snippetText}</code>
        </div>
      </div>
    );
  }
}

export default SnippetItemCodeBlock;
