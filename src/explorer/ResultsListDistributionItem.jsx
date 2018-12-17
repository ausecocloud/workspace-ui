import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { UncontrolledTooltip } from 'reactstrap';

export default class ResultsListDistributionItem extends React.PureComponent {
  static propTypes = {
    distribution: PropTypes.objectOf(PropTypes.any).isRequired,
    selectedDistributions: PropTypes.objectOf(Map).isRequired,
    licenseShortNameFunc: PropTypes.func.isRequired,
    onCheckedChange: PropTypes.func,
  }

  static defaultProps = {
    onCheckedChange: () => { },
  }

  render() {
    const {
      distribution: dist,
      selectedDistributions,
      licenseShortNameFunc,
      onCheckedChange,
    } = this.props;

    /** @type {string} */
    const distId = dist.identifier;
    const checkboxId = `dist-select-${distId}`;
    const licenseTooltipId = `dist-tooltip-${distId}`;

    return (
      <li>
        <label htmlFor={checkboxId}>
          <input type="checkbox" id={checkboxId} checked={selectedDistributions.has(distId)} onChange={e => onCheckedChange(e.target.checked)} />
          <span className="title">{dist.title}</span>
        </label>
        <small className="licence-header"> Format </small>
        <small className="format">{dist.format}</small>
        <i className="licence-hover" id={licenseTooltipId}> <small className="licence-header">  Licence </small>
          <small className="licence">{dist.license ? licenseShortNameFunc(dist.license.name) : 'unknown'}</small>
        </i>
        <UncontrolledTooltip placement="top" target={licenseTooltipId}>
          {dist.license ? dist.license.name : 'None'}
        </UncontrolledTooltip>
      </li>
    );
  }
}
