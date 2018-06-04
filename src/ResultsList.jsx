import React from 'react';
import PropTypes from 'prop-types';
import { Label, Input, Row, Col, Button } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faExternalLinkSquareAlt from '@fortawesome/fontawesome-free-solid/faExternalLinkSquareAlt';
import { formatDate } from './utils';

export default
class ResultsList extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.any).isRequired,
  }

  renderResults() {
    const { data } = this.props;
    const results = data.map((record) => {
      const r = record._source;
      let dists;
      if (r.distributions && r.distributions.length > 0) {
        dists = r.distributions.map((dist) => {
          const url = dist.downloadURL || dist.accessURL;
          return (
            <li key={dist.identifier}><a href={url}>{dist.title}</a> <small className="format">{dist.format}</small></li>
          );
        });
      }
      return (
        <div className="result" key={record._id}>
          <Row>
            <Col md="12">
              {r.title && r.title.length > 0 &&
                <h3>{r.title}</h3>
              }
              {r.publisher.name && r.publisher.name.length > 0 &&
                <p className="source">{r.publisher.name}</p>
              }
              <dl className="dates">
                {r.indexed && r.indexed.length > 0 &&
                  <span key={r.indexed}>
                    <dt>Indexed:</dt>
                    <dd>{formatDate(r.indexed)}</dd>
                  </span>
                }
                {r.modified && r.modified.length > 0 &&
                  <span key={r.mmodified}>
                    <dt>Modifed:</dt>
                    <dd>{formatDate(r.modified)}</dd>
                  </span>
                }
                {r.issued && r.issued.length > 0 &&
                  <span key={r.issued}>
                    <dt>Issued:</dt>
                    <dd>{formatDate(r.issued)}</dd>
                  </span>
                }
              </dl>
              {r.description && r.description.length > 0 &&
                <p>{r.description}</p>
              }
              {r.catalog && r.catalog.length > 0 &&
                <p><strong>Provider:</strong> {r.catalog}</p>
              }
              <ul className="distributions">
                { dists }
              </ul>
              {r.landingPage && r.landingPage.length > 0 &&
                <a className="btn btn-primary btn-sm" href={r.landingPage}>Go to website <FontAwesomeIcon icon={faExternalLinkSquareAlt} /></a>
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
