import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReduxBlockUi from 'react-block-ui/redux';
import { Loader } from 'react-loaders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer } from '@fortawesome/free-solid-svg-icons/faServer';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input,
} from 'reactstrap';
import * as actions from './actions';
import { getProfiles } from '../reducers';


class LaunchServer extends React.Component {
  static propTypes = {
    profiles: PropTypes.arrayOf(PropTypes.any).isRequired,
    username: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      selected: undefined,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // When the modal is presented to the user, go fetch profiles
    if (this.state.modal && !prevState.modal) {
      this.props.dispatch(actions.profilesFetch());
    }
  }

  get selectedProfile() {
    const { profiles } = this.props;
    const { selected } = this.state;

    // Ensure that we only return the `selected` value from the state when it
    // is still valid in the set of available profiles
    if (!selected || !profiles.some(profile => profile.display_name === selected)) {
      return undefined;
    }

    return selected;
  }

  toggle = () => this.setState(prevState => ({ modal: !prevState.modal }));

  launch = () => {
    const { username } = this.props;
    const profile = this.selectedProfile;

    // Don't launch if there is no selected profile
    if (!profile) {
      return;
    }

    this.props.dispatch(actions.serverLaunch({ username, profile }));

    // Close modal
    this.setState(prevState => ({ modal: !prevState.modal }));
  }

  handleChange = e => this.setState({ selected: e.target.value });

  render() {
    const { profiles } = this.props;
    const { modal } = this.state;
    const selected = this.selectedProfile;

    return (
      <tr>
        <td colSpan="4" className="text-center">
          <Button color="secondary" size="sm" onClick={this.toggle}><FontAwesomeIcon icon={faServer} /> Launch notebook server</Button>
          <Modal isOpen={modal} toggle={this.toggle} backdrop="static">
            <ReduxBlockUi tag="div" block={actions.PROFILES_FETCH} unblock={[actions.PROFILES_SUCCEEDED, actions.PROFILES_FAILED]} loader={<Loader active type="ball-pulse" />} className="loader">
              <ModalHeader toggle={this.toggle}>Launch notebook server</ModalHeader>
              <ModalBody>
                <Form>
                  <FormGroup check>
                    {
                      profiles.map(profile => (
                        <Label key={profile.display_name}>
                          <Input
                            type="radio"
                            name="profile"
                            checked={selected === profile.display_name}
                            value={profile.display_name}
                            onChange={this.handleChange}
                          />{' '}
                          <strong>{profile.display_name}</strong>
                          <div>{profile.description}</div>
                        </Label>
                      ))
                    }
                  </FormGroup>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.launch} disabled={!selected}>Launch</Button>{' '}
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
              </ModalFooter>
            </ReduxBlockUi>
          </Modal>
        </td>
      </tr>
    );
  }
}

function mapStateToProps(state) {
  return {
    profiles: getProfiles(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(LaunchServer);
