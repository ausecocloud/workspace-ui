import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Alert, UncontrolledTooltip,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkSquareAlt';
import { formatDate } from '../utils';

export default
class ResultsList extends React.Component {
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

  getLicence(longName) {
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
   * @param {boolean} checked Whether the distribution has been checked to be
   *        added to the selection list
   */
  handleCheckboxChange(dist, checked) {
    // TODO: Component needs to be split so the distribution ID doesn't need to
    // be provided to the handler and instead should be read from the
    // subcomponent's props

    // If checked, add to selection, otherwise remove
    if (checked === true) {
      this.props.addDistToSelection(dist);
    } else {
      this.props.deleteDistFromSelection(dist.identifier);
    }
  }

  renderResults() {
    const { data } = this.props;

    if (data.length > 0) {
      const results = data.map((record, ridx) => {
        const r = record._source;
        let dists;
        if (r.distributions && r.distributions.length > 0) {
          dists = r.distributions.map((dist, didx) => {
            const url = dist.downloadURL || dist.accessURL;
            return (
              <li key={dist.identifier}>
                <label>
                  <input type="checkbox" checked={this.props.selectedDistributions.has(dist.identifier)} onChange={e => this.handleCheckboxChange(dist, e.target.checked)} />
                  <span class="title">{dist.title}</span>
                </label>
                <small className="licence-header"> Format </small>
                <small className="format">{dist.format}</small>
                <i className="licence-hover" id={`dist-${ridx}-${didx}`}> <small className="licence-header">  Licence </small>
                  <small className="licence">{dist.license ? this.getLicence(dist.license.name) : 'unknown'}</small>
                </i>
                <UncontrolledTooltip placement="top" target={`dist-${ridx}-${didx}`}>
                  {dist.license ? dist.license.name : 'None'}
                </UncontrolledTooltip>
              </li>
            );
          });
        }
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
                <ul className="distributions">
                  { dists }
                </ul>
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
        { this.renderResults() }
      </div>
    );
  }
}
