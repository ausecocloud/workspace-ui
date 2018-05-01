import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default
class BasicModal extends React.Component {
  static defaultProps = {
    title: '',
    desc: '',
  }

  static propTypes = {
    title: PropTypes.string,
    desc: PropTypes.string,
    active: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    contents: PropTypes.element.isRequired,
  }

  constructor(props) {
    super(props);

    this.submitHandler = this.submitHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
  }

  submitHandler(e) {
    this.props.submit(e.target.value);
  }

  closeHandler(e) {
    console.log(this.props);
    this.props.close(e.target.value);
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.props.active} toggle={this.closeHandler} className="new-project">
          <ModalHeader toggle={this.closeHandler}>{this.props.title}</ModalHeader>
          <ModalBody>
            <p>{this.props.desc}</p>
            {this.props.contents}
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.submitHandler}>Submit</Button>{' '}
            <Button color="secondary" onClick={this.closeHandler}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
