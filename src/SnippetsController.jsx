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
                          <FontAwesomeIcon icon={faChevronRight} /> &nbsp;
                          {dist.title}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={distId}>
                      <a className="selected-dataset" href="#" onClick={() => this.toggleCollapseDistribution(distId)}>
                        <FontAwesomeIcon icon={faChevronDown} /> &nbsp;
                        {dist.title}
                      </a>
                      <div className="float-right">
                        <a className="btn btn-primary btn-sm"> Store in Drive &nbsp; <FontAwesomeIcon icon={faCloudUploadAlt} /> </a> &nbsp;
                        <a className="btn btn-primary btn-sm"> Download <FontAwesomeIcon icon={faDownload} /></a>
                      </div>

                      <div className="snippet-body">
                        <div>
                          <p>{dist.description}</p>
                        </div>
                        {
                          this.state.snippetLanguages.map(language => (
                            <div key={language}>
                              <div>
                                {language}
                                <a href="#" className="float-right source"> Copy to Clipboard <FontAwesomeIcon icon={faCopy} /></a>
                              </div>

                              <div>
                                <pre>
                                  <code>
                                    {language === 'Python'
&& `import urllib.request
url = '${url}'
data = urllib.request.urlopen(url).read().decode('utf-8')`}
                                    {language === 'R'
&& `url <- "${url}"
# TODO: Download code`}
                                    {language === 'Bash' && `curl -O ${url}`}
                                    {language === 'Web Access' && url}
                                  </code>
                                </pre>
                              </div>

                            </div>
                          ))
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
