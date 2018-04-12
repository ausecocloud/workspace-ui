import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormGroup, Label, Input, Col } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { projectsSelector } from './selectors';
import * as actions from './actions';


function mapStateToProps(state) {
  const projects = projectsSelector(state);
  if (projects) {
    return projects;
  }
  return {
    selected: null,
    projects: [],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: e => dispatch(actions.projectsSelect(e.target.value)),
    dispatch,
  };
}


class Projects extends React.PureComponent {
  static defaultProps = {
    selected: null,
    projects: [],
  }

  static propTypes = {
    selected: PropTypes.string,
    projects: PropTypes.arrayOf(PropTypes.any),
    onChange: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.dispatch(actions.projectsList());
  }

  render() {
    const { selected, projects, onChange } = this.props;

    return (
      <FormGroup row>
        <Label for="exampleSelect" sm={2}>Project</Label>
        <Col sm={8}>
          <Input type="select" name="project" id="projectSelect" selected={selected} onChange={onChange}>
            {projects.map(project => <option key={project.name}>{project.name}</option>)}
          </Input>
        </Col>
      </FormGroup>
    );
  }
}

const MappedProjects = connect(mapStateToProps, mapDispatchToProps)(Projects);

export default withRouter(MappedProjects);
