import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Container, Progress, Button, Label, Form, Input, FormGroup } from 'reactstrap';
import BasicModal from './BasicModal';
import SearchFacet from './SearchFacet';
import ResultsList from './ResultsList';
import BlockUi from 'react-block-ui';
import { Loader } from 'react-loaders';
import axios from 'axios';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import faQuestionCircle from '@fortawesome/fontawesome-free-solid/faQuestionCircle';
import * as actions from './projects/actions';
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

const restrictedPubs = ["Geoscience Australia", "Australian Institute of Marine Science (AIMS)", "Office of Environment and Heritage (OEH)", "Natural Resources, Mines and Energy", "State of the Environment"];

export class Explorer extends React.Component {
  static propTypes = {
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  }
  state = {
    publishers: [],
    publishersLoading: true,
    formats: [],
    formatsLoading: true,
    results: [],
    resultsLoading: true,
  }

  componentWillMount() {
    this.getPublishers();
    this.getFormats();
    this.getInitResults();
  }
  componentDidMount() {
    console.log('Explorer: work in progress.');
  }
  getPublishers() {
    const query = {
      "size": 0,
      "aggs": {
        "publisher_filter": {
          "filter": {
            "terms": {
              "publisher.name.keyword": restrictedPubs,
            },
          },
          "aggs": {
            "publishers": {
              "terms": { "field": "publisher.name.keyword", "size": 100 },
            },
          },
        },
      },
    };

    axios.post(`https://kn-v2-dev-es.oznome.csiro.au/datasets30/_search`, query)
      .then((res) => {
        this.setState({
          publishers: res.data.aggregations.publisher_filter.publishers.buckets,
          publishersLoading: false,
        });
      });
  }

  getFormats() {
    const query = {
      "size": 0,
      "aggs": {
        "publisher_filter": {
          "filter": {
            "terms": {
              "publisher.name.keyword": restrictedPubs,
            },
          },
          "aggs": {
            "formats": {
              "nested": {
                "path": "distributions",
              },
              "aggs": {
                "formats": {
                  "terms": {
                    "field": "distributions.format.keyword",
                    "size": 25,
                  },
                },
              },
            },
          },
        },
      },
    };

    axios.post(`https://kn-v2-dev-es.oznome.csiro.au/datasets30/_search`, query)
      .then((res) => {
        console.log(res);
        this.setState({
          formats: res.data.aggregations.publisher_filter.formats.formats.buckets,
          formatsLoading: false,
        });
      });
  }

  getInitResults() {
    const query = {
      "query": {
        "bool": {
          "must": [
            {
              "terms": {
                "publisher.name.keyword": restrictedPubs,
              },
            },
          ],
        },
      },
    };

    axios.post(`https://kn-v2-dev-es.oznome.csiro.au/datasets30/_search`, query)
      .then((res) => {
        console.log(res);
        this.setState({
          results: res.data.hits.hits,
          resultsLoading: false,
        });
      });
  }

  render() {
    const {
      user, isAuthenticated,
    } = this.props;

    console.log(this.state.results);

    return (
      <section className="explorer">
        <Row className="search-header">
          <Col lg="3" md="12">
            <Col sm="12">
              <span className="results-count"><strong>1024 Results</strong></span>
            </Col>
          </Col>
          <Col lg="9" md="12">
            <Form inline>
              <Col lg="7" md="12">
                <Input type="text" name="search" id="searchTerms" placeholder="Enter search terms ..." />
                <Button><FontAwesomeIcon icon={faSearch} /> Search</Button>
              </Col>
              <Col lg="5" md="12">
                <FormGroup className="sorts">
                  <Label for="sortBy">Sort:</Label>
                  <Input type="select" name="sortBy" id="sortBy">
                    <option defaultValue>Relevance</option>
                    <option>Alphabetical</option>
                  </Input>
                  <Label for="resultsNum">Per Page:</Label>
                  <Input type="select" name="resultsNum" id="resultsNum">
                    <option selected>25</option>
                    <option>50</option>
                  </Input>
                </FormGroup>
              </Col>
            </Form>
          </Col>
        </Row>
        <Row className="search-body">
          <Col lg="3" md="12">
            <aside className="search-sidebar-panel current-search">
              <header>
                Current Search
                <span className="float-right"><a href="#">Clear Search</a></span>
              </header>
              <div className="sidebar-body">
                <div className="selected-facet">
                  <h5>Keywords</h5>
                  <ul>
                    <li>marine <a href="#"><FontAwesomeIcon icon={faTimes} /></a></li>
                  </ul>
                </div>
                <div className="selected-facet">
                  <h5>Service Type(s)</h5>
                  <ul>
                    <li>WMS <a href="#"><FontAwesomeIcon icon={faTimes} /></a></li>
                  </ul>
                </div>
              </div>
            </aside>
            <aside className="search-sidebar-panel facets">
              <header>
                Refine Search
              </header>
              <div className="sidebar-body">
                <div className="facet">
                  <Form className="add-keywords-form" inline>
                    <FormGroup>
                      <Input type="text" name="addKeywords" id="addKeywords" placeholder="Add more keywords ..." />
                      <Button><FontAwesomeIcon icon={faSearch} /></Button>
                    </FormGroup>
                  </Form>
                </div>
                <BlockUi tag="div" blocking={this.state.publishersLoading} loader={<Loader active type="ball-pulse" />}>
                  <SearchFacet title="Publisher" options={this.state.publishers} />
                </BlockUi>
                <BlockUi tag="div" blocking={this.state.formatsLoading} loader={<Loader active type="ball-pulse" />}>
                  <SearchFacet title="Service Type" options={this.state.formats} />
                </BlockUi>
              </div>
            </aside>
          </Col>
          <Col lg="9" md="12">
            <div className="selected">
              <h4>Datasets Selected: 1</h4>
              <a href="#" className="help-link"><FontAwesomeIcon icon={faQuestionCircle} /> How Do I Use This Selection?</a>
              <a href="#" className="btn btn-primary float-right">View Snippets </a>
              <ul className="selected-datasets">
                <li><a className="selected-dataset"> Marine Assets, data.vic.gov.au <FontAwesomeIcon icon={faTimes} /></a></li>
              </ul>
            </div>

            <BlockUi tag="div" blocking={this.state.resultsLoading} loader={<Loader active type="ball-pulse" />}>
              <ResultsList data={this.state.results} />
            </BlockUi>
          </Col>
        </Row>
      </section>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Explorer);
