import React from 'react';
import PropTypes from 'prop-types';
import { Label, Input } from 'reactstrap';

export default
class SearchFacet extends React.Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.any).isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
    };

    this.handleSelectionChange = this.handleSelectionChange.bind(this);
  }

  handleSelectionChange(event) {
    const { target } = event;
    const { selected } = this.state;
    const { type } = this.props;
    let newSelection = [];

    if (target.checked) {
      selected.push(target.value);
      newSelection = selected;
    } else {
      newSelection = selected.filter(e => e !== target.value);
    }

    this.setState({ selected: newSelection }, () => {
      this.props.onUpdate({ type, newSelection });
    });
  }

  renderOptions() {
    const { options } = this.props;
    return options.map(option => (
      <li key={option.key}>
        <Input name={`${option.key}_checkbox`} id={`${option.key}_checkbox`} type="checkbox" value={option.key} onChange={this.handleSelectionChange} />
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
