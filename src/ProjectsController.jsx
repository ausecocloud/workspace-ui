import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button, Input, InputGroup, InputGroupAddon, Label, Row, Col, Container,
} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import ReduxBlockUi from 'react-block-ui/redux';
import { Loader } from 'react-loaders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload';
import { Contents, PathBar } from './projects';
import * as actions from './projects/actions';
import { getContents, getPath } from './reducers';
import { jupyterhub } from './api';


function mapStateToProps(state, ownProps) {
  return {
    contents: getContents(state),
    path: getPath(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // contents
    onClick: (path) => {
      dispatch(actions.contentsPath({ path }));
    },
    onAddFolder: (path, folder) => {
      dispatch(actions.addFolder({ path, folder }));
    },
    onDeleteFolder: (path) => {
      dispatch(actions.deleteFolder({ path }));
    },
    onAddFile: (path, files) => {
      dispatch(actions.uploadFile({ path, files }));
    },
    onDeleteFile: (path, name) => {
      dispatch(actions.deleteFile({ path, name }));
    },
    onDownloadFile: (path, name) => {
      dispatch(actions.downloadFile({ path, name }));
    },
    dispatch,
  };
}


class ProjectsController extends React.Component {
  static propTypes = {
    contents: PropTypes.arrayOf(PropTypes.any).isRequired,
    path: PropTypes.string.isRequired,
    // event handlers
    onClick: PropTypes.func.isRequired,
    onAddFolder: PropTypes.func.isRequired,
    onDeleteFolder: PropTypes.func.isRequired,
    onAddFile: PropTypes.func.isRequired,
    onDeleteFile: PropTypes.func.isRequired,
    onDownloadFile: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  state = {
    addFolder: false,
    newFolder: '',
    addFile: false,
    newFile: [],
  }

  componentDidMount() {
    // good place to trigger ajax data load
    // setState update will trigger render, but before browser updates => no flicker
    this.props.dispatch(actions.contentsPath({ path: '/' }));
  }

  componentDidUpdate(prevProps) {
    // good place to trigger ajax, but should compare to props, to avoid
    // unnecessary ajax calls
    // const { project } = this.props;
    // if (project && (project !== prevProps.project)) {
    //   // project was not available on mount lifecycle, so we triffer loading contents
    //   // during update lifecycle
    //   this.props.dispatch(actions.contentsPath({ project: project.name, path: '/' }));
    // }
  }

  onPath = (path) => {
    const { onClick } = this.props;
    onClick(path);
  }

  onDelete = (path, item) => {
    if (item.content_type === 'application/directory') {
      this.props.onDeleteFolder([path, item.name].join('/'));
    } else {
      this.props.onDeleteFile(path, item.name);
    }
  }

  onDownload = (path, item) => {
    // Reject downloading directories
    if (item.content_type === 'application/directory') {
      return;
    }

    this.props.onDownloadFile(path, item.name);
  }

  addFolder = () => {
    const { path, onAddFolder } = this.props;
    const { addFolder, newFolder } = this.state;
    if (addFolder) {
      // we hit the confirm button
      // validate input
      if (!newFolder) {
        return;
      }
      onAddFolder(path, { name: newFolder });
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
    const { path, onAddFile } = this.props;
    const { addFile, newFile } = this.state;
    if (addFile) {
      // we hit the confirm button
      // validate input
      if (!newFile) {
        return;
      }
      onAddFile(path, newFile);
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
      contents, path,
      onClick,
    } = this.props;

    const {
      addFolder, newFolder,
      addFile, newFile,
    } = this.state;

    const huburl = jupyterhub.getHubUrl();

    return (
      <Container>
        {
          <ReduxBlockUi tag="div" block={actions.CONTENTS_PATH} unblock={[actions.CONTENTS_SUCCEEDED, actions.CONTENTS_FAILED]} loader={<Loader active type="ball-pulse" />} className="loader">
            <Row>
              <Col>
                <h3>Workspace Contents</h3>
                <div className="project-pathbar">
                  <PathBar path={path} onClick={this.onPath} />
                </div>
              </Col>
            </Row>
            <div className="project-contents-table">
              <Row>
                <Col>
                  <ReduxBlockUi tag="div" block={actions.FILE_UPLOAD} unblock={[actions.FILE_UPLOAD_SUCCEEDED, actions.FILE_UPLOAD_FAILED]} className="loader">
                    <Contents key="contents" contents={contents} path={path} onClick={onClick} onDelete={this.onDelete} onDownload={this.onDownload} />
                  </ReduxBlockUi>
                </Col>
              </Row>
              { addFolder
                && (
                  <Row>
                    <Col>
                      <InputGroup key="folder">
                        <Input type="text" value={newFolder} onChange={this.changeNewFolder} required />
                        <InputGroupAddon addonType="append">
                          <Button color="primary" onClick={this.addFolder}><FontAwesomeIcon icon={faCheck} /> Create</Button>
                          <Button color="danger" onClick={this.cancelAddFolder}><FontAwesomeIcon icon={faTimes} /> Cancel</Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                  </Row>
                )
              }
              { addFile
                && (
                  <Row>
                    <Col>
                      <InputGroup key="file">
                        <Label for="uploads" className="btn btn-secondary">Choose File</Label>
                        <Input hidden id="uploads" type="file" onChange={this.changeNewFile} required />
                        <InputGroupAddon addonType="append">
                          <Button color="primary" onClick={this.addFile}><FontAwesomeIcon icon={faCheck} /> Upload</Button>
                          <Button color="danger" onClick={this.cancelAddFile}><FontAwesomeIcon icon={faTimes} /> Cancel</Button>
                        </InputGroupAddon>
                      </InputGroup>
                      {
                        newFile.map(file => (
                          <Row key={file.name} className="pending-uploads">
                            <Col>{file.name}</Col>
                          </Row>
                        ))
                      }
                    </Col>
                  </Row>
                )
              }
              { (!addFile && !addFolder)
                && (
                  <Row>
                    <Col>
                      <Button key="addfolder" color="primary" onClick={this.addFolder}><FontAwesomeIcon icon={faPlusCircle} /> Add Folder</Button>
                      <Button key="uploadfile" color="primary" onClick={this.addFile}><FontAwesomeIcon icon={faUpload} /> Upload File</Button>
                    </Col>
                  </Row>
                )
              }
            </div>
            <Row>
              <Col className="footerCallToAction">
                <p>Need additional datasets? Find them in <Link to="/explorer" title="Find datasets in ecocloud Explorer"><strong><em>Explorer</em></strong></Link></p>
              </Col>
            </Row>
          </ReduxBlockUi>
        }
      </Container>
    );
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectsController));
