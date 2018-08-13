import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Row, Col,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Map, Set } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleLeft, faCaretDown, faServer, faChevronDown, faChevronRight,
  faCopy, faDownload, faCloudUploadAlt,
} from '@fortawesome/free-solid-svg-icons';
import { getSelectedDistributions } from './reducers';

function mapStateToProps(state) {
  return {
    selectedDistributions: getSelectedDistributions(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

/**
 * Generates code snippet text for a given data URL
 *
 * @param {string} language Target language to generate snippet for
 * @param {string} url URL of source data for snippet
 */
function generateSnippetText(language, url) {
  switch (language) {
    case 'Python':
      return `import urllib.request
url = '${url.replace(/'/g, '\\\'')}'
data = urllib.request.urlopen(url).read().decode('utf-8')`;

    case 'R':
      // TODO: Generate download code
      return `url <- "${url}"
# TODO: Download code`;

    case 'Bash':
      return `curl -O ${url}`;

    case 'Web Access':
      return url;

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

  return textCopyPromise
    .catch(() => {
      // Alert when copy failed
      alert('Text was not copied; please copy manually');
    });
}

export class SnippetsController extends React.Component {
  static propTypes = {
    selectedDistributions: PropTypes.instanceOf(Map),
  }

  static defaultProps = {
    selectedDistributions: Map(),
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsedDataset: new Set(),
      snippetLanguages: ['Python', 'R', 'Bash', 'Web Access'],
    };
  }

  /**
   * Toggles the collapsed state of the panel containing a given distribution's
   * snippets
   *
   * @param {string} distId Distribution identifier
   */
  toggleCollapseDistribution(distId) {
    if (this.state.collapsedDataset.has(distId)) {
      // Distribution already exists in set, delete entry => "show distribution"
      this.setState(prevState => ({
        ...prevState,
        collapsedDataset: prevState.collapsedDataset.delete(distId),
      }));
    } else {
      // Distribution not in set, add entry => "hide distribution"
      this.setState(prevState => ({
        ...prevState,
        collapsedDataset: prevState.collapsedDataset.add(distId),
      }));
    }
  }

  render() {
    return (
      <div className="container snippets">
        <h1>Snippets</h1>
        <Row>
          <Col xs="3">
            <Link to="/explorer" className="btn btn-primary btn-sm"><FontAwesomeIcon icon={faArrowCircleLeft} /> Back to Explorer</Link>
          </Col>
          <Col xs="9">
            <div className="float-right">
              <a className="btn btn-primary btn-sm"> Download All Snippets &nbsp; <FontAwesomeIcon icon={faCaretDown} /> </a> &nbsp;
              <a className="btn btn-secondary btn-sm"><FontAwesomeIcon icon={faServer} /> Launch Notebook</a>
            </div>
          </Col>
        </Row>
        <hr />
        <Row className="snippets-body">
          <Col xs="12">
            <ul className="selected-datasets">
              {
                [...this.props.selectedDistributions.values()].map((dist) => {
                  /**
                   * URL of the distribution
                   *
                   * @type {string | undefined}
                   */
                  const url = dist.downloadURL;
                  const distId = dist.identifier;

                  const isCollapsed = this.state.collapsedDataset.has(distId);

                  // If collapsed, render only the collapsed portion
                  if (isCollapsed) {
                    return (
                      <li key={distId}>
                        <a className="selected-dataset" href="#" onClick={() => this.toggleCollapseDistribution(distId)}>
                          <FontAwesomeIcon className="arrow-icon" icon={faChevronRight} /> &nbsp;
                          {dist.title}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={distId}>
                      <a className="selected-dataset" href="#" onClick={() => this.toggleCollapseDistribution(distId)}>
                        <FontAwesomeIcon className="arrow-icon" icon={faChevronDown} /> &nbsp;
                        {dist.title}
                      </a>
                      <div className="float-right">
                        { /* <a className="btn btn-primary btn-sm"> Store in Drive &nbsp; <FontAwesomeIcon icon={faCloudUploadAlt} /> </a> &nbsp; */ }
                        <a className="btn btn-primary btn-sm" href={url} target="_blank" rel="noopener noreferrer"> Download file <FontAwesomeIcon icon={faDownload} /></a>
                      </div>

                      <div className="snippet-body">
                        <div>
                          <p>{dist.description}</p>
                        </div>
                        {
                          this.state.snippetLanguages.map((language) => {
                            // Creating a reference so that the actual <code>
                            // element may be referred to for copying text
                            const snippetTextElementRef = React.createRef();

                            const snippetText = generateSnippetText(language, url);

                            return (
                              <div key={language}>
                                <div>
                                  {language}
                                  <a href="#" className="float-right source" onClick={() => { selectElementText(snippetTextElementRef.current); copyTextToClipboard(snippetText); }}> Copy to Clipboard <FontAwesomeIcon icon={faCopy} /></a>
                                </div>

                                <div>
                                  <code ref={snippetTextElementRef}>{snippetText}</code>
                                </div>

                              </div>
                            );
                          })
                        }
                      </div>
                    </li>
                  );
                })
              }
            </ul>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SnippetsController);
