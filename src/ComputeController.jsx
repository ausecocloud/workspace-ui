import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Col, Row } from 'reactstrap';
import ReduxBlockUi from 'react-block-ui/redux';
import Compute from './compute';
import * as actions from './compute/actions';
import { getServers, getUser } from './reducers';


function mapStateToProps(state) {
  return {
    servers: getServers(state),
    user: getUser(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}


class ComputeController extends React.Component {
  static propTypes = {
    servers: PropTypes.arrayOf(PropTypes.any).isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { user } = this.props;
    this.props.dispatch(actions.serversListStart(user.sub));
  }

  componentWillUnmount() {
    this.props.dispatch(actions.serversListStop());
  }

  render() {
    const {
      servers,
    } = this.props;

    return (
      <Container>
        <Row>
          <Col>
            <h1>Server Configuration</h1>
            <ReduxBlockUi tag="div" block={actions.SERVERS_LIST} unblock={[actions.SERVERS_SUCCEEDED, actions.SERVERS_FAILED]} className="loader">
              <Compute servers={servers} />
            </ReduxBlockUi>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComputeController);
