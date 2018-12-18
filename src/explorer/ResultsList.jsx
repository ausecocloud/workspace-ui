import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Alert,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkSquareAlt';
import { formatDate } from '../utils';
import ResultsListDistributionItem from './ResultsListDistributionItem';

export default class ResultsList extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.any).isRequired,
    license: PropTypes.objectOf(PropTypes.any),
    addDistToSelection: PropTypes.func.isRequired,
    deleteDistFromSelection: PropTypes.func.isRequired,
    selectedDistributions: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  static defaultProps = {
    license: null,
  }

  /**
   * @param {string} longName Full name of the license
   */
  getLicenceShortName = (longName) => {
    const { license } = this.props;
    const longKey = longName.trim().toLocaleLowerCase();
    if (license) {
      const licenseKeys = Object.keys(license);
      for (let i = 0, len = licenseKeys.length; i < len; i += 1) {
        const key = licenseKeys[i];
        if (key.trim().toLocaleLowerCase() === longKey) {
          return license[key];
        }
      }
    }
    return longName;
  }

  /**
   * Handler for adding/removing distributions through checkboxes
   *
   * @param {object} dist Distribution object
   * @param {object} recordMetadata Record metadata (generally `_source`)
   * @param {boolean} checked Whether the distribution has been checked to be
   *        added to the selection list
   */
  onDistributionCheckedChange = (dist, recordMetadata, checked) => {
    // If checked, add to selection, otherwise remove
    if (checked) {
      // The distribution object saved as a merged object with additional
      // properties from the record metadata
      this.props.addDistToSelection({
        ...dist,
        publisher: recordMetadata.publisher && recordMetadata.publisher.name,
        contactPoint: recordMetadata.contactPoint && recordMetadata.contactPoint.identifier,
        landingPage: recordMetadata.landingPage,
      });
    } else {
      this.props.deleteDistFromSelection(dist.identifier);
    }
  }

  renderResults() {
    const { data, selectedDistributions } = this.props;

    if (data.length > 0) {
      const results = data.map((record) => {
        const r = record._source;

        return (
          <div className="result" key={record._id}>
            <Row>
              <Col md="12">
                {
                  r.title && r.title.length > 0
                  && <h3>{r.title}</h3>
                }
                {
                  r.publisher && r.publisher.name && r.publisher.name.length > 0
                  && <p className="source">{r.publisher.name}</p>
                }
                <dl className="dates">
                  {
                    r.indexed && r.indexed.length > 0
                    && (
                      <span key={r.indexed}>
                        <dt>Indexed:</dt>
                        <dd>{formatDate(r.indexed)}</dd>
                      </span>
                    )
                  }
                  {
                    r.modified && r.modified.length > 0
                    && (
                      <span key={r.mmodified}>
                        <dt>Modifed:</dt>
                        <dd>{formatDate(r.modified)}</dd>
                      </span>
                    )
                  }
                  {
                    r.issued && r.issued.length > 0
                    && (
                      <span key={r.issued}>
                        <dt>Issued:</dt>
                        <dd>{formatDate(r.issued)}</dd>
                      </span>
                    )
                  }
                </dl>
                {
                  r.description && r.description.length > 0
                  && <p>{r.description}</p>
                }
                {
                  r.catalog && r.catalog.length > 0
                  && <p><strong>Provider:</strong> {r.catalog}</p>
                }
                {
                  (r.distributions && r.distributions.length > 0)
                  && (
                    <div className="distributions-container">
                      <strong>Data and Resources</strong>
                      <ul className="distributions">
                        {r.distributions.map(dist => (
                          <ResultsListDistributionItem
                            key={dist.identifier}
                            distribution={dist}
                            publisher={r.publisher && r.publisher.name}
                            contactPoint={r.contactPoint && r.contactPoint.identifier}
                            landingPage={r.landingPage}
                            selectedDistributions={selectedDistributions}
                            licenseShortNameFunc={this.getLicenceShortName}
                            onCheckedChange={
                              checked => this.onDistributionCheckedChange(dist, r, checked)
                            }
                          />
                        ))}
                      </ul>
                    </div>
                  )
                }
                {
                  r.landingPage && r.landingPage.length > 0
                  && <a className="btn btn-primary btn-sm" href={r.landingPage}>Go to website <FontAwesomeIcon icon={faExternalLinkSquareAlt} /></a>
                }
              </Col>
            </Row>
          </div>
        );
      });
      return results;
    }

    return (
      <div className="no-results">
        <Alert color="danger">
          No results, please try expanding your search criteria.
        </Alert>
      </div>
    );
  }

  render() {
    return (
      <div className="results">
        {this.renderResults()}
      </div>
    );
  }
}
