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
    this.setState({ projectModalActive: !this.state.projectModalActive });
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
          }
        </Row>
      </Container>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectsController);
