import React from 'react';
import PropTypes from 'prop-types';
import SnippetItemCodeBlock from './SnippetItemCodeBlock';

/**
 * Array of supported languages for snippets
 */
const snippetLanguages = ['Python', 'R', 'Bash', 'Web Access'];

/**
 * Array of supported file types for snippets
 */
const supportedSnippetFileTypes = [
  'PDF',
  'ZIP',
  'TIFF',
  'XLSX',
  'CSV',
  'JPEG',
  'DOCX',
  'PLAIN',
  'XML',
];

/**
 * Generates suggested filename for snippet
 *
 * @param {string} url URL of source data for snippet
 * @param {string} distId Distribution ID
 */
function generateSuggestedFilename(url, distId) {
  // Get the "filename" from the URL where possible, after removal of query
  // string or anchor
  //
  // If the string is blank, then we return the distribution ID
  return url.split(/[?#]/)[0].replace(/^.*[\\/]/, '') || distId;
}

/**
 * Code block content component for `SnippetItem`
 */
class SnippetItemCodeSection extends React.PureComponent {
  static propTypes = {
    url: PropTypes.string,
    distId: PropTypes.string.isRequired,
    fileType: PropTypes.string,
    publisher: PropTypes.string,
    license: PropTypes.string,
    landingPage: PropTypes.string,
    contactPoint: PropTypes.string,
  };

  static defaultProps = {
    url: undefined,
    fileType: undefined,
    publisher: undefined,
    license: undefined,
    landingPage: undefined,
    contactPoint: undefined,
  };

  render() {
    const {
      url,
      distId,
      fileType,
      publisher,
      license,
      landingPage,
      contactPoint,
    } = this.props;

    if (!url) {
      return (
        <div>
          <code>No URL available for this resource</code>
        </div>
      );
    }

    // We shall only produce a code block for whitelisted file types
    if (fileType && supportedSnippetFileTypes.indexOf(fileType) !== -1) {
      return (
        <>
          {snippetLanguages.map((language) => {
            const filename = generateSuggestedFilename(url, distId);
            return (
              <SnippetItemCodeBlock
                language={language}
                url={url}
                filename={filename}
                publisher={publisher}
                contact={contactPoint}
                license={license}
                landingPage={landingPage}
              />
            );
          })}
        </>
      );
    }

    return (
      <div>
        <code>
          # The file type of this resource is not supported; please download by
          visiting the below URL.
          <br />
          <br />
          {url}
        </code>
      </div>
    );
  }
}

export default SnippetItemCodeSection;
