import React from 'react';
import PropTypes from 'prop-types';
import { Label, Input, Row, Col, Button } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faExternalLinkSquareAlt from '@fortawesome/fontawesome-free-solid/faExternalLinkSquareAlt';

export default
class ResultsList extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.any).isRequired,
  }

  renderResults() {
    const { data } = this.props;
    return data.map(record => (
      <div className="result" key={record._id}>
        <Row>
          <Col md="1" className="result-check">
            <Input name={record._id} id={record._id} type="checkbox" />
          </Col>
          <Col md="11">
            {record._source.title.length > 0 &&
              <Label for={record._id}>{record._source.title}</Label>
            }
            {record._source.publisher.name.length > 0 &&
              <p className="source">{record._source.publisher.name}</p>
            }
            {record._source.description.length > 0 &&
              <p>{record._source.description}<a href="#">… more</a></p>
            }
            {record._source.catalog.length > 0 &&
              <p><strong>Provider:</strong> {record._source.catalog}</p>
            }
            {record._source.landingPage.length > 0 &&
              <a className="btn btn-primary btn-sm" href={record._source.landingPage}>Go to website <FontAwesomeIcon icon={faExternalLinkSquareAlt} /></a>
            }
          </Col>
        </Row>
      </div>
    ));
  }

  render() {
    return (
      <div className="results-list">
        <header>
          <div className="bulk-select">
            <Label for="selectAll">
              <Input name="select-all" id="selectAll" type="checkbox" />
              Select All
            </Label>
            <Label for="selectNone">
              <Input name="select-none" id="selectNone" type="checkbox" />
              Select None
            </Label>
          </div>
          <div className="float-right pagination">
            <span className="pages">Page 1 / 24</span>
            <Button color="primary" size="sm">1</Button>
            <Button color="primary" size="sm">2</Button>
            <Button color="primary" size="sm">3</Button>
            <Button color="primary" size="sm">4</Button>
            <Button color="primary" size="sm">&raquo;</Button>
          </div>
        </header>
        { this.renderResults() }
      </div>
    );
  }
}
