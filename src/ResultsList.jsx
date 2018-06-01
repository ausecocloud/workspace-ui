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
          <Col md="12">
            {record._source.title.length > 0 &&
              <Label for={record._id}>{record._source.title}</Label>
            }
            {record._source.publisher.name.length > 0 &&
              <p className="source">{record._source.publisher.name}</p>
            }
            {record._source.description.length > 0 &&
              <p>{record._source.description}</p>
            }
            {record._source.catalog.length > 0 &&
              <p><strong>Provider:</strong> {record._source.catalog}</p>
            }
            <ul>
              {record._source.distributions.length > 0 &&
                record._source.distributions.map(dist => (
                  <li key={dist.identifier}><a href={dist.downloadURL}>{dist.title} ({dist.format})</a></li>
                ))
              }
            </ul>
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
      <div className="results">
        { this.renderResults() }
      </div>
    );
  }
}
