import React from 'react';
import PropTypes from 'prop-types';
import { Label, Input } from 'reactstrap';

export default
class SearchFacet extends React.Component {
  static propTypes = {
    // `items` is an array of { id: string, name: string, count: number }
    items: PropTypes.arrayOf(PropTypes.any).isRequired,

    // `selectedItems` is an ImmutableJS Set of IDs which are selected
    selectedItems: PropTypes.objectOf(PropTypes.any).isRequired,

    title: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onReset: PropTypes.func,
  }

  static defaultProps = {
    onReset: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      // Collapsed by default
      collapsed: true,

      // Quick filter value
      filter: '',
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

  handleFilterChange = (event) => {
    this.setState({
      filter: (event.target.value || ''),
    });
  }

  handleResetClick = () => {
    this.setState({
      filter: '',
    });

    this.props.onReset();
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
    const { selectedItems: selectedSet } = this.props;
    const { collapsed, filter } = this.state;

    // Retrieve the split array and recombine them so that the list always puts
    // selected items first
    const { selectedItems, nonselectedItems } = this.splitItemsBySelection();
    let items = [...selectedItems, ...nonselectedItems];

    /** Number of elements that will be rendered */
    let limit = items.length;

    // If we have a filter typed in, then filter the reordered items by this
    // keyword
    const trimmedFilter = filter.trim();
    const applyFilter = trimmedFilter.length !== 0;

    if (applyFilter) {
      const filterRegex = new RegExp(trimmedFilter, 'i');
      items = items.filter(item => item.name.search(filterRegex) !== -1);
      limit = items.length;
    } else if (collapsed) {
      // Limit to a maximum of 10 items if collapsed, but not filtering
      limit = this.getCollapsedItemLimit();
    }

    const elements = [];
    for (let i = 0; i < limit; i += 1) {
      const { id, name, count } = items[i];
      elements.push((
        <li key={id}>
          <Input name={`${id}_checkbox`} id={`${id}_checkbox`} type="checkbox" checked={selectedSet.has(id)} onChange={e => this.handleSelectionChange(id, e)} />
          <Label for={`${id}_checkbox`}>{name} <span className="count"> {count}</span></Label>
        </li>
      ));
    }

    /** Whether collapse toggle link should be rendered */
    let renderCollapseToggle = true;

    if (applyFilter) {
      // Never render collapse toggle when filtering
      renderCollapseToggle = false;
    } else if (!collapsed) {
      // If expanded, always show toggle
      renderCollapseToggle = true;
    } else {
      // Toggle depends on whether we already are showing all items
      renderCollapseToggle = elements.length !== items.length;
    }

    return {
      elements,
      renderCollapseToggle,
    };
  }

  render() {
    const { elements, renderCollapseToggle } = this.renderOptions();

    return (
      <div className="facet">
        <h5>{this.props.title}</h5>
        <Input
          type="text"
          className="filter-field"
          name="search_facet_filter"
          placeholder="Filter..."
          value={this.state.filter}
          onChange={this.handleFilterChange}
        />
        <ul>
          { elements }
        </ul>
        {
          // Only render collapse toggle link if it is actually useful
          renderCollapseToggle
          && (
            <>
              <button type="button" onClick={(e) => { e.preventDefault(); this.toggleCollapsed(); }}>
                { this.state.collapsed ? 'More...' : 'Fewer...' }
              </button>
              {' '}
            </>
          )
        }
        <button type="button" onClick={this.handleResetClick}>Reset</button>
      </div>
    );
  }
}
