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
    const results = data.map((record) => {
      let dists;
      if (record._source.distributions && record._source.distributions.length > 0) {
        dists = record._source.distributions.map((dist) => {
          const url = dist.downloadURL || dist.accessURL;
          return (
            <li key={dist.identifier}><a href={url}>{dist.title} ({dist.format})</a></li>
          );
        });
      }
      return (
        <div className="result" key={record._id}>
          <Row>
            <Col md="12">
              {record._source.title && record._source.title.length > 0 &&
                <Label for={record._id}>{record._source.title}</Label>
              }
              {record._source.publisher.name && record._source.publisher.name.length > 0 &&
                <p className="source">{record._source.publisher.name}</p>
              }
              {record._source.description && record._source.description.length > 0 &&
                <p>{record._source.description}</p>
              }
              {record._source.catalog && record._source.catalog.length > 0 &&
                <p><strong>Provider:</strong> {record._source.catalog}</p>
              }
              <ul>
                { dists }
              </ul>
              {record._source.landingPage && record._source.landingPage.length > 0 &&
                <a className="btn btn-primary btn-sm" href={record._source.landingPage}>Go to website <FontAwesomeIcon icon={faExternalLinkSquareAlt} /></a>
              }
            </Col>
          </Row>
        </div>
      );
    });

    return results;
  }

  render() {
    return (
      <div className="results">
        { this.renderResults() }
      </div>
    );
  }
}
