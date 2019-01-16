import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';

class ToolAccordion extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    imageSource: PropTypes.string,
    imageAltText: PropTypes.string,
    children: PropTypes.node,
  }

  static defaultProps = {
    imageSource: undefined,
    imageAltText: '',
    children: undefined,
  }

  state = {
    expanded: false,
  }

  toggleAccordion = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  };

  render() {
    return (
      <Card className="tool-accordion">
        <CardBody>
          <Button className="title-link" onClick={this.toggleAccordion}>
            <CardTitle>
              {this.props.imageSource && <img className="card-logo" src={this.props.imageSource} alt={this.props.imageAltText} />}
              {this.props.title}
            </CardTitle>
          </Button>
          {this.state.expanded && (
            <div className="slot-wrapper">
              {this.props.children}
            </div>
          )}
        </CardBody>
      </Card>
    );
  }
}

export default ToolAccordion;
