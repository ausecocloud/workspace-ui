import React from 'react';
import PropTypes from 'prop-types';
import { Label, Input } from 'reactstrap';

export default
class SearchFacet extends React.Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.any).isRequired,
    title: PropTypes.string.isRequired,
  }

  renderOptions() {
    const { options } = this.props;
    return options.map(option => (
      <li key={option.key}>
        <Input name={`${option.key}_checkbox`} id={`${option.key}_checkbox`} type="checkbox" checked />
        <Label for={`${option.key}_checkbox`} >{option.key} <span className="count"> {option.doc_count}</span></Label>
      </li>
    ));
  }

  render() {
    return (
      <div className="facet">
        <h5>{this.props.title}</h5>
        <ul>
          { this.renderOptions() }
        </ul>
      </div>
    );
  }
}
