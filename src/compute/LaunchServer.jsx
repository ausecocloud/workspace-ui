import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

  static getDerivedStateFromProps(props, state) {
    const { selected } = state;
    let defaultSelected = null;
    if (props.profiles.length) {
      defaultSelected = props.profiles[0].display_name;
    }
    if (!selected) {
      return { selected: defaultSelected };
    }
    // TODO: should check if selected is still in props .. if not then reset selected
    for (let i = 0; i < props.profiles.length; i += 1) {
      if (selected === props.profiles[i].display_name) {
        return null;
      }
    }
    // no longer in list ... reset to first element
    return { selected: defaultSelected };
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
