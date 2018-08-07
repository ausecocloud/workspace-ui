import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Row, Col,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Map } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleLeft, faCaretDown, faServer, faChevronDown, faChevronRight,
  faCopy, faDownload, faCloudUploadAlt,
} from '@fortawesome/free-solid-svg-icons';
import { getUser, getAuthenticated } from './reducers';

function mapStateToProps(state) {
  return {
    user: getUser(state),
    isAuthenticated: getAuthenticated(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export class SnippetsController extends React.Component {
  static propTypes = {
    // user: PropTypes.objectOf(PropTypes.any).isRequired,
    // isAuthenticated: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsedDataset: new Map(),
      selectedDatasets: new Map(),
      snippetLanguages: ['Python', 'R', 'Bash', 'Web Access'],
    };
  }

  componentWillMount() {
    // console.log(this.props)
  }

  componentDidMount() {
    const tempSelectDatasets = JSON.parse(localStorage.getItem('selectedDatasets'));
    this.setState({ selectedDatasets: new Map(tempSelectDatasets) });
  }

  collapseDataset(id) {
    // console.log(this.state.collapsedDataset)
    if (this.state.collapsedDataset.get(id)) {
      this.setState((prevState) => {
        const tempCollapsedDataset = prevState.collapsedDataset.set(id, false);
        return { collapsedDataset: tempCollapsedDataset };
      });
    } else {
      this.setState((prevState) => {
        const tempCollapsedDataset = prevState.collapsedDataset.set(id, true);
        return { collapsedDataset: tempCollapsedDataset };
      });
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
                [...this.state.selectedDatasets.values()].map((record) => {
                  const distributionUrls = record._source.distributions.map(dist => (dist.downloadURL ? dist.downloadURL : ''));
                  // console.log(distributionUrls)
                  if (this.state.collapsedDataset.get(record._id)) {
                    return (
                      <li key={record._id}>
                        <a className="selected-dataset" href="#" onClick={() => this.collapseDataset(record._id)}>
                          <FontAwesomeIcon icon={faChevronDown} /> &nbsp;
                          {record._source.title}
                        </a>
                        <div className="float-right">
                          <a className="btn btn-primary btn-sm"> Store in Drive &nbsp; <FontAwesomeIcon icon={faCloudUploadAlt} /> </a> &nbsp;
                          <a className="btn btn-primary btn-sm"> Download <FontAwesomeIcon icon={faDownload} /></a>
                        </div>

                        <div className="snippet-body">
                          <div>
                            <p>{record._source.description}</p>
                            <p className="source">Provider: <a href={record._source.landingPage}> {record._source.landingPage} </a></p>
                          </div>
                          {
                            this.state.snippetLanguages.map((language, index) => (
                              <div key={index}>
                                <div>
                                  {language}
                                  <a href="#" className="float-right source"> Copy to Clipboard <FontAwesomeIcon icon={faCopy} /></a>
                                </div>

                                <div>
                                  <pre>
                                    <code>
                                      {language === 'Python' ? `dataset_urls = [\n${distributionUrls.join(',\t\t\n')} \t\n]` : ''}
                                      {language === 'R' ? `dataset_urls <- array(c(\n${distributionUrls.join(',\t\t\n')}\t\n), dim=c(1, ${distributionUrls.length}, 1))` : ''}
                                      {language === 'Bash' ? distributionUrls.join('\n') : ''}
                                      {language === 'Web Access' ? distributionUrls.join('\n') : ''}
                                    </code>
                                  </pre>
                                </div>

                              </div>
                            ))
                          }
                        </div>
                      </li>);
                  }
                  return (
                    <li key={record._id}>
                      <a className="selected-dataset" href="#" onClick={() => this.collapseDataset(record._id)}>
                        <FontAwesomeIcon icon={faChevronRight} /> &nbsp;
                        {record._source.title}
                        <p className="source" />
                      </a>
                    </li>);
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
