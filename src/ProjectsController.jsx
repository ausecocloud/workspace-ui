import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Input, InputGroup, InputGroupAddon, Label, Row, Col, Container } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import ReduxBlockUi from 'react-block-ui/redux';
import 'react-block-ui/style.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import faUpload from '@fortawesome/fontawesome-free-solid/faUpload';
import faServer from '@fortawesome/fontawesome-free-solid/faServer';
import { Contents, PathBar } from './projects';
import * as actions from './projects/actions';
import { getContents, getProjects, getPath } from './reducers';


function mapStateToProps(state) {
  return {
    projects: getProjects(state),
    contents: getContents(state),
    path: getPath(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // contents
    onClick: (project, path) => {
      dispatch(actions.contentsPath({ project, path }));
    },
    onAddFolder: (project, path, folder) => {
      dispatch(actions.addFolder({ project, path, folder }));
    },
    onDeleteFolder: (project, path) => {
      dispatch(actions.deleteFolder({ project, path }));
    },
    onAddFile: (project, path, files) => {
      dispatch(actions.uploadFile({ project, path, files }));
    },
    onDeleteFile: (project, path, name) => {
      dispatch(actions.deleteFile({ project, path, name }));
    },
    dispatch,
  };
}


class ProjectsController extends React.Component {
  static propTypes = {
    match: PropTypes.objectOf(PropTypes.any).isRequired,
    projects: PropTypes.arrayOf(PropTypes.any).isRequired,
    contents: PropTypes.arrayOf(PropTypes.any).isRequired,
    path: PropTypes.string.isRequired,
    // event handlers
    onClick: PropTypes.func.isRequired,
    onAddFolder: PropTypes.func.isRequired,
    onDeleteFolder: PropTypes.func.isRequired,
    onAddFile: PropTypes.func.isRequired,
    onDeleteFile: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  state = {
    addFolder: false,
    newFolder: '',
    addFile: false,
    newFile: [],
  }

  componentDidMount() {
    this.props.dispatch(actions.projectsList());
    this.props.dispatch(actions.contentsPath({ project: this.props.match.params.id, path: '/' }));
  }

  onPath = (path) => {
    const { match, onClick } = this.props;
    onClick(match.params.id, path);
  }

  onDelete = (project, path, item) => {
    if (item.content_type === 'application/directory') {
      this.props.onDeleteFolder(project, [path, item.name].join('/'));
    } else {
      this.props.onDeleteFile(project, path, item.name);
    }
  }

  addFolder = () => {
    const { match, path, onAddFolder } = this.props;
    const { addFolder, newFolder } = this.state;
    if (addFolder) {
      // we hit the confirm button
      // validate input
      if (!newFolder) {
        return;
      }
      onAddFolder(match.params.id, path, { name: newFolder });
      this.setState({
        addFolder: false,
        newFolder: '',
      });
    } else {
      this.setState({ addFolder: true });
    }
  }

  cancelAddFolder = () => this.setState({ addFolder: false });

  changeNewFolder = e => this.setState({ newFolder: e.target.value });

  addFile = () => {
    const { match, path, onAddFile } = this.props;
    const { addFile, newFile } = this.state;
    if (addFile) {
      // we hit the confirm button
      // validate input
      if (!newFile) {
        return;
      }
      onAddFile(match.params.id, path, newFile);
      this.setState({
        addFile: false,
        newFile: [],
      });
    } else {
      this.setState({ addFile: true });
    }
  }

  cancelAddFile = () => this.setState({ addFile: false });

  changeNewFile = e => this.setState({ newFile: Array.from(e.target.files) });

  render() {
    const {
      projects, contents, path,
      onClick, match,
    } = this.props;

    const {
      addFolder, newFolder,
      addFile, newFile,
    } = this.state;

    const currentProject = projects.filter(project => project.name === match.params.id)[0];

    return (
      <Container>
        {currentProject &&
          <ReduxBlockUi tag="div" block={actions.CONTENTS_PATH} unblock={[actions.CONTENTS_SUCCEEDED, actions.CONTENTS_FAILED]} className="loader">
            <Row>
              <Col>
                <Link to="/drive" className="back-crumb">&laquo; Back to <em><strong>Drive</strong></em></Link>
                <h1>{currentProject.name}</h1>
                <div className="placeholder">
                  <p><strong>Date Created:</strong> 11 Apr, 2018</p>
                  <p>Project description lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <h3>Project Contents</h3>
                <div className="project-pathbar">
                  <PathBar project={currentProject.name} path={path} onClick={this.onPath} />
                </div>
              </Col>
            </Row>
            <div className="project-contents-table">
              <Row>
                <Col>
                  <Contents key="contents" contents={contents} project={currentProject.name} path={path} onClick={onClick} onDelete={this.onDelete} />
                </Col>
              </Row>
              { addFolder &&
                <Row>
                  <Col>
                    <InputGroup key="folder">
                      <Input type="text" value={newFolder} onChange={this.changeNewFolder} required />
                      <InputGroupAddon addonType="append">
                        <Button color="primary" onClick={this.addFolder}><FontAwesomeIcon icon={faCheck} /></Button>
                        <Button color="danger" onClick={this.cancelAddFolder}><FontAwesomeIcon icon={faTimes} /></Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                </Row>
              }
              { addFile &&
                <Row>
                  <Col>
                    <InputGroup key="file">
                      <Label for="uploads" className="btn btn-primary">Choose Files</Label>
                      <Input hidden id="uploads" type="file" onChange={this.changeNewFile} required />
                      <InputGroupAddon addonType="append">
                        <Button color="primary" onClick={this.addFile}><FontAwesomeIcon icon={faCheck} /></Button>
                        <Button color="danger" onClick={this.cancelAddFile}><FontAwesomeIcon icon={faTimes} /></Button>
                      </InputGroupAddon>
                    </InputGroup>
                    { newFile.map(file => (
                      <Row key={file.name}>
                        <Col>{file.name}</Col>
                      </Row>
                      ))
                    }
                  </Col>
                </Row>
              }
              { (!addFile && !addFolder) &&
                <Row>
                  <Col>
                    <Button key="addfolder" color="success" onClick={this.addFolder}><FontAwesomeIcon icon={faPlusCircle} /> Add Folder</Button>
                    <Button key="uploadfile" color="success" onClick={this.addFile}><FontAwesomeIcon icon={faUpload} /> Upload File</Button>
                  </Col>
                </Row>
              }
            </div>
            <Row>
              <Col className="footerCallToAction">
                <Link className="btn btn-xl btn-secondary" to={`compute/${currentProject.name}`} title="Launch this project in ecocloud Compute"><FontAwesomeIcon icon={faServer} />  Launch in <strong><em>Compute</em></strong></Link>
                <p>Need additional datasets? Find them in <Link to="explorer" title="Find datasets in ecocloud Explorer"><strong><em>Explorer</em></strong></Link></p>
              </Col>
            </Row>
          </ReduxBlockUi>
        }
      </Container>
    );
  }
}


export default (withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectsController)));
