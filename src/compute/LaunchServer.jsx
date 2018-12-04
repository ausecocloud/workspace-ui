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
      selected: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO: can we improve this? ... it seems to be a bit convoluted.
    if (this.state.modal && !prevState.modal) {
      // made visible ... dispatch fetch.
      this.props.dispatch(actions.profilesFetch());
    }
    // check selected
    const { selected } = this.state;
    if (this.props.profiles.length === 0) {
      if (selected) {
        this.setState({ selected: null });
      }
    } else {
      let defaultSelected = this.props.profiles[0].display_name;
      // is selected still valid?
      for (let i = 0; i < this.props.profiles.length; i += 1) {
        if (selected === this.props.profiles[i].display_name) {
          defaultSelected = selected;
          break;
        }
      }
      if (defaultSelected !== selected) {
        this.setState({ selected: this.props.profiles[0].display_name });
      }
    }
  }

  toggle = () => this.setState(prevState => ({ modal: !prevState.modal }));

  launch = () => {
    const { username } = this.props;
    const { selected } = this.state;
    this.props.dispatch(actions.serverLaunch({ username, profile: selected }));
    this.setState(prevState => ({ modal: !prevState.modal }));
  }

  handleChange = e => this.setState({ selected: e.target.value });

  render() {
    const { profiles } = this.props;
    const { modal, selected } = this.state;

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
                          <strong>{ profile.display_name }</strong>
                          <div>{ profile.description }</div>
                        </Label>
                      ))
                    }
                  </FormGroup>
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(LaunchServer);
