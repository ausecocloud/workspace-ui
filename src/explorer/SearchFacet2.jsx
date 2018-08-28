import React from 'react';
import PropTypes from 'prop-types';
import { Label, Input } from 'reactstrap';

export default
class SearchFacet2 extends React.Component {
  static propTypes = {
    // `items` is an array of { id: string, name: string, count: number }
    items: PropTypes.arrayOf(PropTypes.any).isRequired,

    // `selectedItems` is an ImmutableJS Set of IDs which are selected
    selectedItems: PropTypes.objectOf(PropTypes.any).isRequired,

    title: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      // Collapsed by default
      collapsed: true,
    };
  }

  getCollapsedItemLimit() {
    const { items, selectedItems } = this.props;
    const maxItems = 10;

    // Item limit caps the number of maximum items
    if (items.length < maxItems) {
      return items.length;
    }

    // Always show all selected items
    if (selectedItems.size > maxItems) {
      return selectedItems.size;
    }

    // The maximum is determined by the fixed amount set above
    return maxItems;
  }

  /**
   * @param {string} id ID of item that has its selection changed
   * @param {object} event Input checkbox change event
   */
  handleSelectionChange(id, event) {
    /** @type {boolean} */
    const { checked } = event.target;

    this.props.onUpdate({ id, checked });
  }

  toggleCollapsed() {
    this.setState(prevState => ({ collapsed: !prevState.collapsed }));
  }

  splitItemsBySelection() {
    const { items, selectedItems: selectedSet } = this.props;

    const selectedItems = [];
    const nonselectedItems = [];

    items.forEach((item) => {
      if (selectedSet.has(item.id)) {
        selectedItems.push(item);
      } else {
        nonselectedItems.push(item);
      }
    });

    return {
      selectedItems,
      nonselectedItems,
    };
  }

  renderOptions() {
    const { items, selectedItems: selectedSet } = this.props;

    let limit = items.length;

    // Limit to a maximum of 10 items if collapsed
    if (this.state.collapsed) {
      limit = this.getCollapsedItemLimit();
    }

    // Retrieve the split array and recombine them so that the list always puts
    // selected items first
    const { selectedItems, nonselectedItems } = this.splitItemsBySelection();
    const reorderedItems = [...selectedItems, ...nonselectedItems];

    const elements = [];
    for (let i = 0; i < limit; i += 1) {
      const { id, name, count } = reorderedItems[i];
      elements.push((
        <li key={id}>
          <Input name={`${id}_checkbox`} id={`${id}_checkbox`} type="checkbox" checked={selectedSet.has(id)} onChange={e => this.handleSelectionChange(id, e)} />
          <Label for={`${id}_checkbox`}>{name} <span className="count"> {count}</span></Label>
        </li>
      ));
    }

    return elements;
  }

  render() {
    return (
      <div className="facet">
        <h5>{this.props.title}</h5>
        <ul>
          { this.renderOptions() }
        </ul>
        {
          // Only render collapse toggle link if it is actually useful
          (this.getCollapsedItemLimit() !== this.props.items.length)
          && (
            <a href="#" onClick={(e) => { e.preventDefault(); this.toggleCollapsed(); }}>
              { this.state.collapsed ? 'More...' : 'Fewer...' }
            </a>
          )
        }
      </div>
    );
  }
}
