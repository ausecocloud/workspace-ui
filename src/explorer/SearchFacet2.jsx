import React from 'react';
import PropTypes from 'prop-types';
import { Label, Input } from 'reactstrap';

export default
class SearchFacet2 extends React.Component {
  static propTypes = {
    // `items` is an array of { id: string, label: string, count: number }
    items: PropTypes.arrayOf(PropTypes.object).isRequired,

    // `selectedItems` is an ImmutableJS Set of IDs which are selected
    selectedItems: PropTypes.object.isRequired,

    title: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }

  /**
   * @param {string} id ID of item that has its selection changed
   * @param {object} event Input checkbox change event
   */
  handleSelectionChange(id, event) {
    /** @type {boolean} */
    const checked = event.target.checked;

    this.props.onUpdate({ id, checked });
  }

  renderOptions() {
    const { items, selectedItems } = this.props;

    return items.map(({ id, label, count }) => (
      <li key={id}>
        <Input name={`${id}_checkbox`} id={`${id}_checkbox`} type="checkbox" checked={selectedItems.has(id)} onChange={ (e) => this.handleSelectionChange(id, e) } />
        <Label for={`${id}_checkbox`}>{ label } <span className="count"> { count }</span></Label>
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
