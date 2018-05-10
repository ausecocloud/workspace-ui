import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Row, Col, Container } from 'reactstrap';
import ReduxBlockUi from 'react-block-ui/redux';
import 'react-block-ui/style.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle';
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
    onCreateProject: (name) => {
      dispatch(actions.createProject({ name }));
    },
    dispatch,
  };
}

class ProjectsController extends React.Component {
  static propTypes = {
    projects: PropTypes.arrayOf(PropTypes.any).isRequired,
    // event handlers
    onCreateProject: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  state = {
    projectModalActive: false,
    newProject: {},
  }

  componentDidMount() {
    this.props.dispatch(actions.projectsList());
  }

  getNewProjectForm = (formstate) => {
    this.setState({ newProject: formstate });
  }

  toggleProjectModal = () => {
    this.setState({ projectModalActive: !this.state.projectModalActive });
  }

  newProjectSubmit = () => {
    const { onCreateProject } = this.props;
    const { newProject } = this.state;
    if (newProject && Object.keys(newProject).length > 0) {
      onCreateProject(newProject.name);

      this.setState({
        newProject: {},
      });
      // close modal
      this.setState({
        projectModalActive: false,
      }, this.props.dispatch(actions.projectsList()));
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
          { projects &&
            <ReduxBlockUi tag="div" block={actions.PROJECTS_LIST} unblock={[actions.PROJECTS_SUCCEEDED, actions.PROJECTS_FAILED]} className="loader">
              <Col sm={{ size: 10, offset: 1 }}>
                <h1>Your Projects</h1>
                <Row>
                  <Projects key="projects" projects={projects} />
                  <hr />
                </Row>
                <Row>
                  <Col>
                    <Button color="success" onClick={this.toggleProjectModal}><FontAwesomeIcon icon={faPlusCircle} /> New Project</Button>
                    <BasicModal
                      title="Create A Project"
                      desc="You can create a new project to organise your work using this form."
                      active={this.state.projectModalActive}
                      close={this.toggleProjectModal}
                    >
                      <CreateProjectForm
                        data={this.getNewProjectForm}
                        submit={this.newProjectSubmit}
                        close={this.toggleProjectModal}
                      />
                    </BasicModal>
                  </Col>
                </Row>
              </Col>
            </ReduxBlockUi>
          }
        </Row>
      </Container>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectsController);
