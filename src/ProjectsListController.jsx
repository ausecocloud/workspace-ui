import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button, Row, Col, Container,
} from 'reactstrap';
import ReduxBlockUi from 'react-block-ui/redux';
import { Loader } from 'react-loaders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { Projects, CreateProjectForm } from './projects';
import BasicModal from './BasicModal';
import * as actions from './projects/actions';
import { getProjects } from './reducers';


function mapStateToProps(state) {
  return {
    projects: getProjects(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

class ProjectsController extends React.Component {
  static propTypes = {
    projects: PropTypes.arrayOf(PropTypes.any).isRequired,
    // event handlers
    dispatch: PropTypes.func.isRequired,
  }

  state = {
    projectModalActive: false,
  }

  componentDidMount() {
    this.props.dispatch(actions.projectsList());
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
      projects,
    } = this.props;

    return (
      <Container>
        <Row>
          { projects
            && (
              <ReduxBlockUi tag="div" block={actions.PROJECTS_LIST} unblock={[actions.PROJECTS_SUCCEEDED, actions.PROJECTS_FAILED]} loader={<Loader active type="ball-pulse" />} className="loader">
                <Col sm={{ size: 12 }}>
                  <h1>Your Workspace</h1>
                  <p><em>ecocloud <strong>Workspace</strong></em> is where we’ll store all your code from the R and SciPy servers.</p>
                  <ul>
                    <li>This is your persistent storage space. You have 10 GB available to you.</li>
                    <li>We encourage you to only use this as storage for code.</li>
                    <li>You can import and export your data and results from your server.</li>
                    <li>To get the most out of the <em>ecocloud <strong>Workspace</strong></em> feature please watch our tutorial [add link to support article with walkthrough video] or read the [ecocloud Workspace overview] support article.</li>
                  </ul>
                  <Row>
                    <Projects key="projects" projects={projects} />
                    <hr />
                  </Row>
                  <Row>
                    <Col>
                      <Button color="primary" onClick={this.toggleProjectModal}><FontAwesomeIcon icon={faPlusCircle} /> New Project</Button>
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
                    </Col>
                  </Row>
                </Col>
              </ReduxBlockUi>
            )
          }
        </Row>
      </Container>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectsController);
