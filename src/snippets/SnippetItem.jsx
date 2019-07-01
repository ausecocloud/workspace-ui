import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';

import SnippetItemCodeSection from './SnippetItemCodeSection';

export class SnippetItem extends React.Component {
  static propTypes = {
    distribution: PropTypes.objectOf(PropTypes.any).isRequired,
    publisher: PropTypes.string,
    contactPoint: PropTypes.string,
    landingPage: PropTypes.string,
    collapsed: PropTypes.bool,
    toggleCollapsed: PropTypes.func.isRequired,
  };

  static defaultProps = {
    publisher: undefined,
    contactPoint: undefined,
    landingPage: undefined,
    collapsed: false,
  };

  toggleCollapsed = (e) => {
    this.props.toggleCollapsed(this.props.distribution.identifier);
    e.preventDefault();
  };

  render() {
    const {
      distribution: dist,
      publisher,
      contactPoint,
      landingPage,
    } = this.props;

    /** @type {string | undefined} */
    const url = dist.downloadURL || dist.accessURL;
    /** @type {string} */
    const distId = dist.identifier;
    /** @type {boolean} */
    const isCollapsed = this.props.collapsed;
    /** @type {string | undefined} */
    const license = dist.license && dist.license.name;
    /** @type {string | undefined} */
    const fileType = dist.format;

    // If collapsed, render only the collapsed portion
    if (isCollapsed) {
      return (
        <li key={distId}>
          <span
            className="selected-dataset"
            role="button"
            tabIndex="-1"
            onClick={this.toggleCollapsed}
            onKeyPress={this.toggleCollapsed}
          >
            <FontAwesomeIcon className="arrow-icon" icon={faChevronRight} />
            &nbsp;
            {dist.title}
          </span>
        </li>
      );
    }

    return (
      <li key={distId}>
        <span
          className="selected-dataset"
          role="button"
          tabIndex="-1"
          onClick={this.toggleCollapsed}
          onKeyPress={this.toggleCollapsed}
        >
          <FontAwesomeIcon className="arrow-icon" icon={faChevronDown} /> &nbsp;
          {dist.title}
        </span>
        <div className="float-right">
          {/* <a className="btn btn-primary btn-sm">
                 Store in Workspace &nbsp; <FontAwesomeIcon icon={faCloudUploadAlt} />
               </a> &nbsp; */}
          {url && (
            <a
              className="btn btn-primary btn-sm"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download file <FontAwesomeIcon icon={faDownload} />
            </a>
          )}
        </div>

        <div className="snippet-body">
          <div>
            <p>{dist.description}</p>
          </div>
          <SnippetItemCodeSection
            {...{
              url,
              distId,
              fileType,
              publisher,
              license,
              landingPage,
              contactPoint,
            }}
          />
        </div>
      </li>
    );
  }
}

export default SnippetItem;
