import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Row, Col, Container, Progress,
} from 'reactstrap';
import ReduxBlockUi from 'react-block-ui/redux';
import { Loader } from 'react-loaders';
import axios from 'axios';
import * as actions from './projects/actions';
import * as computeActions from './compute/actions';
import {
  getProjects, getUser, getAuthenticated, getStats, getServers,
} from './reducers';
import { ProjectsTableBasic } from './projects';
import { ComputeTableBasic } from './compute';
import { formatDate, bytesToSize } from './utils';

const FeedMe = require('feedme');

function mapStateToProps(state) {
  return {
    user: getUser(state),
    isAuthenticated: getAuthenticated(state),
    projects: getProjects(state),
    stats: getStats(state),
    servers: getServers(state),
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
    servers: PropTypes.arrayOf(PropTypes.any).isRequired,
  }

  state = {
    feed: ['No new notifications.'],
    feedCancellationSource: undefined,
  }

  componentWillMount() {
    const { user } = this.props;

    this.getFeed();

    // Start polling for JupyterHub server information
    this.props.dispatch(computeActions.serversListStart(user.sub));
  }

  componentDidMount() {
    this.props.dispatch(actions.projectsList());
    this.props.dispatch(actions.getStats());
  }

  componentWillUnmount() {
    // Stop polling for JupyterHub server information
    this.props.dispatch(computeActions.serversListStop());

    // Cancel outstanding feed fetch
    const { feedCancellationSource } = this.state;

    if (feedCancellationSource) {
      feedCancellationSource.cancel();
    }
  }

  getFeed = () => {
    // We keep track of the cancellation token in the state so that this request
    // can be cancelled when the component is unmounted, especially when a
    // quick unmount happens due to something like the sign in redirect
    const feedCancellationSource = axios.CancelToken.source();

    this.setState({
      feedCancellationSource,
    });

    axios.get('https://www.ecocloud.org.au/category/notifications/feed/', {
      cancelToken: feedCancellationSource.token,
    })
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

  render() {
    const {
      user, projects, isAuthenticated, stats, servers,
    } = this.props;

    // Quota figure can be `null`, in which case we replace with `0`
    const quota = stats.quota || 0;
    const { used } = stats;

    const usedBytes = bytesToSize(used, false);
    const totalBytes = bytesToSize(quota);

    // Usage is rendered as 0% usage when the quota itself is 0
    const usagePercent = quota === 0 ? 0 : (used / quota) * 100;
    const usageNum = `${usedBytes} / ${totalBytes}`;

    const progColor = () => {
      if (usagePercent < 50) return 'primary';
      if (usagePercent < 75) return 'warning';
      return 'danger';
    };

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
          <Col>
            <p>[intro text]</p>
          </Col>
        </Row>
        <Row>
          <Col sm={{ size: 9 }}>
            <Row>
              <Col sm="12">
                <h2>Servers</h2>
                <ReduxBlockUi tag="div" block={computeActions.SERVERS_LIST} unblock={[computeActions.SERVERS_SUCCEEDED, computeActions.SERVERS_FAILED]} loader={<Loader active type="ball-pulse" />} className="loader">
                  <ComputeTableBasic servers={servers} username={user.sub} />
                </ReduxBlockUi>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <h2>Projects</h2>
                <ReduxBlockUi tag="div" block={actions.PROJECTS_LIST} unblock={[actions.PROJECTS_SUCCEEDED, actions.PROJECTS_FAILED]} loader={<Loader active type="ball-pulse" />} className="loader">
                  <ProjectsTableBasic projects={projects} />
                </ReduxBlockUi>
                <div className="storage">
                  <ReduxBlockUi tag="div" block={actions.PROJECTS_STATS} unblock={[actions.PROJECTS_STATS_SUCCEEDED, actions.PROJECTS_STATS_FAILED]} loader={<Loader active type="ball-pulse" />} className="loader">
                    <p>Persistent storage used <span className="storage-int">{usageNum}</span></p>
                    <Progress color={progColor()} value={usagePercent} />
                  </ReduxBlockUi>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <h2>Find Datasets</h2>
                <p>Find datasets from hundreds of publishers through our <Link to="/explorer"><em>ecocloud <strong>Explorer</strong></em></Link> page.</p>
              </Col>
            </Row>
          </Col>
          <Col sm={{ size: 3 }}>
            <Row>
              <h2>Getting Started</h2>
              <div className="dash-activity">
                <ul>
                  <li><p>[links to support articles]</p></li>
                </ul>
              </div>
            </Row>
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
