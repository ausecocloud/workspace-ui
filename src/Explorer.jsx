import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col, Button, Label, Form, Input, FormGroup } from 'reactstrap';
import BlockUi from 'react-block-ui';
import { Loader } from 'react-loaders';
import axios from 'axios';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import faQuestionCircle from '@fortawesome/fontawesome-free-solid/faQuestionCircle';
import SearchFacet from './SearchFacet';
import ResultsList from './ResultsList';
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

function pagination(currentPage, pageCount) {
  const delta = 2;
  const left = currentPage - delta;
  const right = currentPage + delta + 1;
  let result = [];
  result = Array.from({ length: pageCount }, (v, k) => k + 1)
    .filter(i => i && i >= left && i < right);

  result = result.slice(0, 5);

  // this isn't very solid
  // keeping it for improvement later
  if (result.length > 1) {
    // Add first page and dots
    if (result[0] > 1) {
      result.unshift('First');
    }
    // Add dots and last page
    if (result[result.length - 1] < pageCount) {
      result.push('Last');
    }
  }
  return result;
}

const restrictedPubs = ["Geoscience Australia", "Australian Institute of Marine Science (AIMS)", "Office of Environment and Heritage (OEH)", "Natural Resources, Mines and Energy", "State of the Environment"];

export class Explorer extends React.Component {
  static propTypes = {
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
  }

  state = {
    publishers: [],
    publishersLoading: true,
    formats: [],
    formatsLoading: true,
    results: [],
    resultsLoading: true,
    perpage: 10,
    hits: 0,
    page: 1,
    query: {
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
    },
  }

  componentWillMount() {
    this.getPublishers();
    this.getFormats();
    this.getResults(this.state.query);
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
        this.setState({
          formats: res.data.aggregations.publisher_filter.formats.formats.buckets,
          formatsLoading: false,
        });
      });
  }

  getResults() {
    const { query } = this.state;

    query.from = (this.state.page * this.state.perpage);
    query.size = this.state.perpage;

    axios.post(`https://kn-v2-dev-es.oznome.csiro.au/datasets30/_search`, query)
      .then((res) => {
        this.setState({
          results: res.data.hits.hits,
          resultsLoading: false,
          hits: res.data.hits.total,
        });
      });
  }

  changePage(n) {
    const page = n;
    this.setState({ page }, () => this.getResults());
  }

  renderPageButtons() {
    const { page, hits, perpage } = this.state;
    const last = hits / perpage;
    const pages = pagination(page, last);
    const pageButtons = pages.map((pageNo) => {
      if (pageNo === 'First') {
        return <Button color="primary" size="sm" key={pageNo} onClick={() => this.changePage(1)}>&laquo;</Button>;
      } else if (pageNo === 'Last') {
        return <Button color="primary" size="sm" key={pageNo} onClick={() => this.changePage(last)}>&raquo;</Button>;
      }
      return <Button color="primary" size="sm" key={pageNo} onClick={() => this.changePage(pageNo)} className={(pageNo === this.state.page) ? "active" : ""} disabled={(pageNo === this.state.page)}>{pageNo}</Button>;
    });

    return pageButtons;
  }

  render() {
    const {
      user, isAuthenticated,
    } = this.props;

    return (
      <section className="explorer">
        <Row className="search-header">
          <Col lg="3" md="12">
            <Col sm="12">
              <span className="results-count"><strong>{this.state.hits} Results</strong></span>
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
                  <Input type="select" name="resultsNum" id="resultsNum" defaultValue="10">
                    <option>10</option>
                    <option>25</option>
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
              <div className="results-list">
                <header>
                  <div className="pagination">
                    <span className="pages">Page {this.state.page} / {this.state.hits / this.state.perpage}</span>
                    { this.renderPageButtons() }
                  </div>
                </header>
                <ResultsList data={this.state.results} />
                <footer>
                  <div className="pagination">
                    <span className="pages">Page {this.state.page} / {this.state.hits / this.state.perpage}</span>
                    { this.renderPageButtons() }
                  </div>
                </footer>
              </div>
            </BlockUi>
          </Col>
        </Row>
      </section>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Explorer);
