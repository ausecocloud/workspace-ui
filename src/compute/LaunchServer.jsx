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
import { getProfiles, getFlavours } from '../reducers';


class LaunchServer extends React.Component {
  static propTypes = {
    profiles: PropTypes.arrayOf(PropTypes.any).isRequired,
    flavours: PropTypes.arrayOf(PropTypes.any).isRequired,
    username: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      selectedProfile: null,
      selectedFlavour: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO: can we improve this? ... it seems to be a bit convoluted.
    if (this.state.modal && !prevState.modal) {
      // made visible ... dispatch fetch.
      this.props.dispatch(actions.profilesFetch());
    }
    // check selected
    const { selectedProfile } = this.state;
    if (this.props.profiles.length === 0) {
      if (selectedProfile) {
        this.setState({ selectedProfile: null });
      }
    } else {
      let defaultSelected = this.props.profiles[0].id;
      // is selectedProfile still valid?
      for (let i = 0; i < this.props.profiles.length; i += 1) {
        if (selectedProfile === this.props.profiles[i].id) {
          defaultSelected = selectedProfile;
          break;
        }
      }
      // TODO: should pick first entry with default set to true
      if (defaultSelected !== selectedProfile) {
        this.setState({ selectedProfile: this.props.profiles[0].id });
      }
    }
  }

  toggle = () => this.setState(prevState => ({ modal: !prevState.modal }));

  launch = () => {
    const { username } = this.props;
    const { selectedProfile, selectedFlavour } = this.state;
    this.props.dispatch(actions.serverLaunch({
      username, profile: selectedProfile, flavour: selectedFlavour,
    }));
    this.setState(prevState => ({ modal: !prevState.modal }));
  }

  handleProfileChange = e => this.setState({ selectedProfile: e.target.value });

  handleFlavourChange = e => this.setState({ selectedFlavour: e.target.value });

  render() {
    const { profiles, flavours } = this.props;
    const { modal, selectedProfile, selectedFlavour } = this.state;

    return (
      <tr>
        <td colSpan="4" className="text-center">
          <Button color="secondary" size="sm" onClick={this.toggle}><FontAwesomeIcon icon={faServer} /> Launch notebook server</Button>
          <Modal isOpen={modal} toggle={this.toggle} backdrop="static" size="lg">
            <ReduxBlockUi tag="div" block={actions.PROFILES_FETCH} unblock={[actions.PROFILES_SUCCEEDED, actions.PROFILES_FAILED]} loader={<Loader active type="ball-pulse" />} className="loader">
              <ModalHeader toggle={this.toggle}>Launch notebook server</ModalHeader>
              <ModalBody>
                <Form>
                  <FormGroup tag="fieldset">
                    <legend>Server Type</legend>
                    {
                      profiles.map(profile => (
                        <FormGroup check key={profile.id}>
                          <Label>
                            <Input
                              type="radio"
                              name="profile"
                              checked={selectedProfile === profile.id}
                              value={profile.id}
                              onChange={this.handleProfileChange}
                            />{' '}
                            <strong>{ profile.display_name }</strong>
                            <div>{ profile.description }</div>
                          </Label>
                        </FormGroup>
                      ))
                    }
                  </FormGroup>
                  { flavours.length > 0 && (
                    <FormGroup tag="fieldset">
                      <legend>Server configuration</legend>
                      {
                        flavours.map(flavour => (
                          <FormGroup check key={flavour.id}>
                            <Label>
                              <Input
                                type="radio"
                                name="flavour"
                                checked={selectedFlavour
                                  ? selectedFlavour === flavour.id
                                  : flavour.default}
                                value={flavour.id}
                                onChange={this.handleFlavourChange}
                              />{' '}
                              <strong>{ flavour.display_name }</strong>
                              <div>{ flavour.description }</div>
                            </Label>
                          </FormGroup>
                        ))
                      }
                    </FormGroup>)
                  }
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.launch}>Launch</Button>{' '}
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
    flavours: getFlavours(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(LaunchServer);
