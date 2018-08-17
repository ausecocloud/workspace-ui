import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

export default
class BasicModal extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    desc: PropTypes.string,
    active: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    // submit: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
  }

  static defaultProps = {
    title: '',
    desc: '',
  }

  closeHandler = e => this.props.close(e.target.value);

  render() {
    return (
      <Modal isOpen={this.props.active} toggle={this.closeHandler} className="new-project">
        <ModalHeader toggle={this.closeHandler}>{this.props.title}</ModalHeader>
        <ModalBody>
          <p>{this.props.desc}</p>
          {this.props.children}
        </ModalBody>
      </Modal>
    );
  }
}
