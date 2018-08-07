import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Row, Col, Container, Progress, Button,
} from 'reactstrap';
import ReduxBlockUi from 'react-block-ui/redux';
import { Loader } from 'react-loaders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faServer } from '@fortawesome/free-solid-svg-icons/faServer';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons/faFolderOpen';
import { faSearchPlus } from '@fortawesome/free-solid-svg-icons/faSearchPlus';
import axios from 'axios';
import * as actions from './projects/actions';
import BasicModal from './BasicModal';
import { jupyterhub } from './api';
import {
  getProjects, getUser, getAuthenticated, getStats,
} from './reducers';
import { ProjectsTableBasic, CreateProjectForm } from './projects';
import { formatDate, bytesToSize } from './utils';

const FeedMe = require('feedme');

function mapStateToProps(state) {
  return {
    user: getUser(state),
    isAuthenticated: getAuthenticated(state),
    projects: getProjects(state),
    stats: getStats(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export class Dashboard extends React.Component {
  static propTypes = {
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    projects: PropTypes.arrayOf(PropTypes.any).isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    stats: PropTypes.objectOf(PropTypes.any).isRequired,
  }

  state = {
    feed: ['No new notifications.'],
    projectModalActive: false,
  }

  componentWillMount() {
    this.getFeed();
  }

  componentDidMount() {
    this.props.dispatch(actions.projectsList());
    this.props.dispatch(actions.getStats());
  }

  getFeed = () => {
    axios.get('https://www.ecocloud.org.au/category/notifications/feed/')
      .then(res => res.data)
      .then((body) => {
        const parser = new FeedMe(false);
        const feed = [];
        // register all event handlers before we push data into the parser
        parser.on('item', (item) => {
          // need to format date string
          const desc = item.description.substring(0, 80);
          const date = formatDate(item.pubdate);
          const feedItem = (
            <li key={item.link}>
              <p><strong>{date}</strong></p>
              <p>{item.title}</p>
              <p><span dangerouslySetInnerHTML={{ __html: desc }} /> <a href={item.link} target="_blank" rel="noopener noreferrer">... Read more</a></p>
            </li>
          );
          feed.push(feedItem);
        });
        parser.on('end', () => {
          this.setState({ feed });
        });
        // write is a blocking call
        parser.write(body);
        // trigger end event handler ....
        // could just do setState here as well
        parser.end();
      });
  }

  toggleProjectModal = () => {
    this.setState(prevState => ({ projectModalActive: !prevState.projectModalActive }));
  }

  newProjectSubmit = (formData) => {
    if (formData && Object.keys(formData).length > 0) {
      // submit ajax call
      this.props.dispatch(actions.createProject(formData));
      // close modal
      this.setState({
        projectModalActive: false,
      });
    } else {
      console.log('return invalid here');
    }
  }

  render() {
    const {
      user, projects, isAuthenticated, stats,
    } = this.props;

    const used = bytesToSize(stats.used);
    const total = bytesToSize(stats.quota);
    const usageNum = `${used} / ${total}`;
    const usagePercent = (stats.used / stats.quota) * 100;
    const progColor = () => {
      if (usagePercent < 50) return 'primary';
      if (usagePercent < 75) return 'warning';
      return 'danger';
    };
    const huburl = jupyterhub.getHubUrl();

    return (
      <Container className="dashboard">
        <Row>
          <Col>
            { isAuthenticated
              && <h1>Welcome {user.name}</h1>
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
                    <Link to="explorer" className="btn btn-lg btn-dashboard btn-primary" title="Find Datasets in ecocloud Explorer">
                      <FontAwesomeIcon icon={faSearchPlus} /> <br /> Find datasets in <strong><em>Explorer</em></strong>
                    </Link>
                  </Col>
                  <Col md="4">
                    <Link to="drive" className="btn btn-lg btn-dashboard btn-primary" title="Manage files in Drive">
                      <FontAwesomeIcon icon={faFolderOpen} /> <br /> Manage files in <strong><em>Drive</em></strong>
                    </Link>
                  </Col>
                  <Col md="4">
                    <a href={`${huburl}/hub/home`} target="_blank" className="btn btn-lg btn-dashboard btn-primary" title="Start a service in Compute" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faServer} /> <br /> Start a service in <strong><em>Compute</em></strong>
                    </a>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col sm="12">
                <div className="storage">
                  <h2>Your Resources</h2>
                  <ReduxBlockUi tag="div" block={actions.PROJECTS_STATS} unblock={[actions.PROJECTS_STATS_SUCCEEDED, actions.PROJECTS_STATS_FAILED]} loader={<Loader active type="ball-pulse" />} className="loader">
                    <p>Storage Space <span className="storage-int">{usageNum}</span></p>
                    <Progress color={progColor()} value={usagePercent} />
                  </ReduxBlockUi>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <div className="home-projects-table">
                  <h2>Your Projects</h2>
                  <ReduxBlockUi tag="div" block={actions.PROJECTS_LIST} unblock={[actions.PROJECTS_SUCCEEDED, actions.PROJECTS_FAILED]} loader={<Loader active type="ball-pulse" />} className="loader">
                    <ProjectsTableBasic projects={projects} />
                  </ReduxBlockUi>
                  <div className="table-footer">
                    <Button onClick={this.toggleProjectModal} className="btn btn-lg btn-success">
                      <FontAwesomeIcon icon={faPlusCircle} /> Create New Project
                    </Button>
                  </div>
                  <BasicModal
                    title="Create A Project"
                    desc="You can create a new project to organise your work using this form."
                    active={this.state.projectModalActive}
                    close={this.toggleProjectModal}
                  >
                    <CreateProjectForm
                      submit={this.newProjectSubmit}
                      close={this.toggleProjectModal}
                    />
                  </BasicModal>
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
