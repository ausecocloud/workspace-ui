import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Container, Progress } from 'reactstrap';
import 'react-block-ui/style.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle';
import faServer from '@fortawesome/fontawesome-free-solid/faServer';
import faFolderOpen from '@fortawesome/fontawesome-free-solid/faFolderOpen';
import faSearchPlus from '@fortawesome/fontawesome-free-solid/faSearchPlus';
import * as actions from './projects/actions';
import { getProjects, getUser, getAuthenticated } from './reducers';
import { ProjectsTableBasic } from './projects';

const FeedMe = require('feedme');
const http = require('http');

function mapStateToProps(state) {
  return {
    user: getUser(state),
    isAuthenticated: getAuthenticated(state),
    projects: getProjects(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

function formatDate(date) {
  const formattedDate = new Date(date);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const string = `${formattedDate.getDate()} ${months[formattedDate.getMonth()]} ${formattedDate.getFullYear()}`;

  return string;
}

class Dashboard extends React.Component {
  static propTypes = {
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    projects: PropTypes.arrayOf(PropTypes.any).isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  state = {
    feed: [],
  }

  componentWillMount() {
    this.getFeed();
  }
  componentDidMount() {
    this.props.dispatch(actions.projectsList());
  }

  getFeed = () => {
    http.get('http://www.ecocloud.org.au/category/notifications/feed/', (res) => {
      if (res.statusCode !== 200) {
        console.error(new Error(`status code ${res.statusCode}`));
        return;
      }
      const parser = new FeedMe(true);
      const feed = [];
      parser.on('item', (item) => {
        // need to format date string
        const desc = item.description.substring(0, 80);
        const date = formatDate(item.pubdate);
        const feedItem = (
          <li key={item.link}>
            <p><strong>{date}</strong></p>
            <p>{item.title}</p>
            <p><span dangerouslySetInnerHTML={{ __html: desc }} /> <a href={item.link} target="_blank">... Read more</a></p>
          </li>
        );
        feed.push(feedItem);
      });
      res.pipe(parser);

      this.setState({ feed });
    });
  }


  render() {
    const {
      user, projects, isAuthenticated,
    } = this.props;

    return (
      <Container className="dashboard">
        <Row>
          <Col>
            {isAuthenticated &&
              <h1>Welcome {user.name}</h1>
            }
          </Col>
        </Row>
        <Row>
          <Col sm={{ size: 9 }}>
            <Row>
              <Col sm="12">
                <h2>Getting Started</h2>
                <Row>
                  <Col md="4">
                    <Link to="explorer" className="btn btn-lg btn-dashboard btn-success" title="Find Datasets in ecocloud Explorer">
                      <FontAwesomeIcon icon={faSearchPlus} /> <br /> Find datasets in <strong><em>Explorer</em></strong>
                    </Link>
                  </Col>
                  <Col md="4">
                    <Link to="drive" className="btn btn-lg btn-dashboard btn-success" title="Find Datasets in ecocloud Explorer">
                      <FontAwesomeIcon icon={faFolderOpen} /> <br /> Manage files in <strong><em>Drive</em></strong>
                    </Link>
                  </Col>
                  <Col md="4">
                    <Link to="compute" className="btn btn-lg btn-dashboard btn-success" title="Find Datasets in ecocloud Explorer">
                      <FontAwesomeIcon icon={faServer} /> <br /> Start a service in <strong><em>Compute</em></strong>
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <div className="storage">
                  <h2>Your Resources</h2>
                  <p>Storage Space <span className="storage-int">8.2GB / 10GB</span></p>
                  <Progress multi>
                    <Progress bar color="success" value="50" />
                    <Progress bar color="warning" value="30" />
                    <Progress bar color="danger" value="10" />
                  </Progress>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <div className="home-projects-table">
                  <h2>Your Projects</h2>
                  <ProjectsTableBasic projects={projects} />
                  <div className="table-footer">
                    <Link to="drive" title="Create new project on ecocloud Drive" className="btn btn-lg btn-success"><FontAwesomeIcon icon={faPlusCircle} /> Create New Project</Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col sm={{ size: 3 }}>
            <Row>
              <h2>Notifications</h2>
              <div className="dash-activity">
                <ul>{ this.state.feed }</ul>
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
