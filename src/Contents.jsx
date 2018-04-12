import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroup, ListGroupItem, Col } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { contentsSelector } from './selectors';


function mapStateToProps(state) {
  const contents = contentsSelector(state);
  if (contents) {
    return {
      contents,
    };
  }
  return {
    contents: [
      {
        content_type: 'test',
        name: 'Name1',
      },
      {
        content_type: 'none',
        name: 'Name2',
      },
    ],
  };
}


class Contents extends React.PureComponent {
  static defaultProps = {
    contents: [],
  }

  static propTypes = {
    contents: PropTypes.arrayOf(PropTypes.any),
  }

  render() {
    const { contents } = this.props;

    return (
      <ListGroup>
        {
          contents.map(item => (
            <ListGroupItem key={item.name}>
              <Col sm={3}>
                {item.content_type}
              </Col>
              <Col sm={9}>
                {item.name}
              </Col>
            </ListGroupItem>
          ))
        }
      </ListGroup>
    );
  }
}

const MappedContents = connect(mapStateToProps)(Contents);

export default withRouter(MappedContents);
