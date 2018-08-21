import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Row, Col, Alert,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Map, Set } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleLeft, faServer,
} from '@fortawesome/free-solid-svg-icons';
import { getSelectedDistributions } from './reducers';
import SnippetItem from "./snippets/SnippetItem";
import { jupyterhub } from './api';

function mapStateToProps(state) {
  return {
    selectedDistributions: getSelectedDistributions(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}


/**
 * Renders given distributions into `SnippetItem`s
 *
 * @param {object[]} distributions Distribution objects
 * @param {Set<string>} collapsedDataset Set of distribution IDs where the
 *        distribution is collapsed
 * @param {(id: string) => void} toggleCollapseDistribution Handler for toggling
 *        the collapsed state of the selected distribution
 */
function renderSnippets(distributions, collapsedDataset, toggleCollapseDistribution) {
  return (
    <ul className="selected-datasets">
      {
        distributions.map(dist => (
          <SnippetItem
            key={dist.identifier}
            distribution={dist}
            collapsed={collapsedDataset.has(dist.identifier)}
            toggleCollapsed={toggleCollapseDistribution}
          />
        ))
      }
    </ul>
  );
}

/**
 * Renders elements for displaying information when there are no snippets
 * available
 */
function renderNoSnippets() {
  return (
    <div className="no-snippets">
      <Alert color="light" fade={false}>
        <h4 className="alert-heading">No snippets selected</h4>
        <p className="mb-0">Start by selecting datasets from the <em><Link to="/explorer">Explorer</Link></em></p>
      </Alert>
    </div>
  );
}

export class SnippetsController extends React.Component {
  static propTypes = {
    selectedDistributions: PropTypes.instanceOf(Map),
  }

  static defaultProps = {
    selectedDistributions: Map(),
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsedDataset: Set(),
    };
  }

  /**
   * Toggles the collapsed state of the panel containing a given distribution's
   * snippets
   *
   * @param {string} distId Distribution identifier
   */
  toggleCollapseDistribution(distId) {
    if (this.state.collapsedDataset.has(distId)) {
      // Distribution already exists in set, delete entry => "show distribution"
      this.setState(prevState => ({
        ...prevState,
        collapsedDataset: prevState.collapsedDataset.delete(distId),
      }));
    } else {
      // Distribution not in set, add entry => "hide distribution"
      this.setState(prevState => ({
        ...prevState,
        collapsedDataset: prevState.collapsedDataset.add(distId),
      }));
    }
  }

  render() {
    const huburl = jupyterhub.getHubUrl();
    const distributionMap = this.props.selectedDistributions;

    return (
      <div className="container snippets">
        <h1>Snippets</h1>
        <Row>
          <Col xs="3">
            <Link to="/explorer" className="btn btn-primary btn-sm"><FontAwesomeIcon icon={faArrowCircleLeft} /> Back to Explorer</Link>
          </Col>
          <Col xs="9">
            <div className="float-right">
              { /* <a className="btn btn-primary btn-sm"> Download All Snippets &nbsp; <FontAwesomeIcon icon={faCaretDown} /> </a> &nbsp; */ }
              <a className="btn btn-secondary btn-sm" href={`${huburl}/hub/home`} target="_blank" title="Launch a notebook in ecocloud Compute" rel="noopener noreferrer"><FontAwesomeIcon icon={faServer} /> Launch Notebook</a>
            </div>
          </Col>
        </Row>
        <hr />
        <Row className="snippets-body">
          <Col xs="12">
            { distributionMap.size === 0 ? renderNoSnippets() : renderSnippets(distributionMap.valueSeq(), this.state.collapsedDataset, this.toggleCollapseDistribution.bind(this)) }
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SnippetsController);
