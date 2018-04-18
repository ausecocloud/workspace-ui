import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormGroup, Label, Input, Col } from 'reactstrap';
import { withRouter } from 'react-router-dom';
// TODO: this is the weird bit here, we import selectors from app root
//       that's the last bit that makes our components not reusable
import { getProjects, getSelected } from '../reducers';
import * as actions from './actions';


function mapStateToProps(state) {
  return {
    projects: getProjects(state),
    selected: getSelected(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: project => dispatch(actions.projectsSelect({ project, path: '' })),
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

  onChange = (e) => {
    const { onChange } = this.props;
    const project = e.target.value;
    onChange(project);
  }

  renderProjectOptions() {
    const { projects } = this.props;
    return projects.map(project =>
      <option key={project.name}>{project.name}</option>);
  }

  render() {
    const { selected } = this.props;

    return (
      <FormGroup row>
        <Label for="exampleSelect" sm={2}>Project</Label>
        <Col sm={8}>
          <Input type="select" name="project" id="projectSelect" defaultValue={selected || ''} onChange={this.onChange}>
            <option value="" disabled>Please select</option>
            { this.renderProjectOptions() }
          </Input>
        </Col>
      </FormGroup>
    );
  }
}

const MappedProjects = connect(mapStateToProps, mapDispatchToProps)(Projects);

export default withRouter(MappedProjects);
