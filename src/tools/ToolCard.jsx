import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
} from 'reactstrap';

class ToolCard extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    url: PropTypes.string,
    imageSource: PropTypes.string,
    imageAltText: PropTypes.string,
    openInNewWindow: PropTypes.bool,
    onLinkClick: PropTypes.func,
  }

  static defaultProps = {
    description: undefined,
    url: '#',
    imageSource: undefined,
    imageAltText: '',
    openInNewWindow: true,
    onLinkClick: undefined,
  }

  render() {
    const { openInNewWindow, onLinkClick } = this.props;
    const linkProps = {};

    if (openInNewWindow) {
      linkProps.target = '_blank';
      linkProps.rel = 'noopener noreferrer';
    }

    if (onLinkClick) {
      linkProps.onClick = onLinkClick;
    }

    return (
      <Card className="tool-card">
        <CardBody>
          <a href={this.props.url} {...linkProps}>
            {this.props.imageSource && <img className="card-logo" src={this.props.imageSource} alt={this.props.imageAltText} />}
            <CardTitle>
              {this.props.title}
            </CardTitle>
          </a>
          {this.props.description && (
            <CardText>
              {this.props.description}
            </CardText>
          )}
        </CardBody>
      </Card>
    );
  }
}

export default ToolCard;
