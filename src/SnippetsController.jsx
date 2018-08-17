import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Row, Col,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Map, Set } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleLeft, faCaretDown, faServer, faChevronDown, faChevronRight,
  faCopy, faDownload, faCloudUploadAlt,
} from '@fortawesome/free-solid-svg-icons';
import { getSelectedDistributions } from './reducers';
import SnippetItem from "./snippets/SnippetItem";

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
    return (
      <div className="container snippets">
        <h1>Snippets</h1>
        <Row>
          <Col xs="3">
            <Link to="/explorer" className="btn btn-primary btn-sm"><FontAwesomeIcon icon={faArrowCircleLeft} /> Back to Explorer</Link>
          </Col>
          <Col xs="9">
            <div className="float-right">
              <a className="btn btn-primary btn-sm"> Download All Snippets &nbsp; <FontAwesomeIcon icon={faCaretDown} /> </a> &nbsp;
              <a className="btn btn-secondary btn-sm"><FontAwesomeIcon icon={faServer} /> Launch Notebook</a>
            </div>
          </Col>
        </Row>
        <hr />
        <Row className="snippets-body">
          <Col xs="12">
            <ul className="selected-datasets">
              {
                this.props.selectedDistributions.valueSeq().map(dist => (
                  <SnippetItem key={dist.identifier} distribution={dist} collapsed={this.state.collapsedDataset.has(dist.identifier)} toggleCollapsed={id => this.toggleCollapseDistribution(id)} />
                ))
              }
            </ul>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SnippetsController);
