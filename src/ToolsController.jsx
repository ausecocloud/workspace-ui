import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Container,
  Col,
  Row,
  Card,
  CardBody,
  CardTitle,
  CardText,
} from 'reactstrap';
// import ReduxBlockUi from 'react-block-ui/redux';
// import { Loader, Types } from 'react-loaders';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faRProject } from '@fortawesome/free-brands-svg-icons/faRProject';
import Rlogo from './assets/images/Rlogo.svg';
import JupyterLogo from './assets/images/JupyterLogo.svg';
import CoesraLogo from './assets/images/CoesraLogo.png';
import ALALogo from './assets/images/ALAlogo.jpg';
import BCCVLLogo from './assets/images/BCCVLlogo.png';
import QGisLogo from './assets/images/QGisLogo.png';
import PanoplyLogo from './assets/images/PanoplyLogo.png';
import BiodiverseLogo from './assets/images/BiodiverseLogo.png';
import KeplerLogo from './assets/images/KeplerLogo.png';
import MCASSLogo from './assets/images/MCASSlogo.jpg';
import AURINLogo from './assets/images/AURINlogo.png';
// import Compute from './compute';
import * as actions from './compute/actions';
import { getServers, getUser } from './reducers';
import { jupyterhub } from './api';


function mapStateToProps(state) {
  return {
    servers: getServers(state),
    user: getUser(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}


class ToolsController extends React.Component {
  static propTypes = {
    // servers: PropTypes.arrayOf(PropTypes.any).isRequired,
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { user } = this.props;
    this.props.dispatch(actions.serversListStart(user.sub));
  }

  componentWillUnmount() {
    this.props.dispatch(actions.serversListStop());
  }

  render() {
    // const {
    //   servers,
    // } = this.props;

    const huburl = jupyterhub.getHubUrl();

    // return (
    //   <Container>
    //     <Row>
    //       <Col>
    //         <h1>Server Configuration</h1>
    //         <ReduxBlockUi tag="div" block={actions.SERVERS_LIST} unblock={[actions.SERVERS_SUCCEEDED, actions.SERVERS_FAILED]} loader={<Loader active type="ball-pulse" />} className="loader">
    //           <Compute servers={servers} />
    //         </ReduxBlockUi>
    //       </Col>
    //     </Row>
    //   </Container>
    // );

    return (
      <Container>
        <Row>
          <Col>
            <h1>Command-line Tools</h1>
            <Row>
              <Col>
                <a href={`${huburl}/hub/home`} target="_blank">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        <img className="card-logo" src={Rlogo} alt="R Logo" /> RStudio & R Jupyter
                      </CardTitle>
                      <CardText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                      </CardText>
                    </CardBody>
                  </Card>
                </a>
              </Col>
              <Col>
                <a href={`${huburl}/hub/home`} target="_blank">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        <img className="card-logo" src={JupyterLogo} alt="Jupyter Logo" />  SciPy Jupyter
                      </CardTitle>
                      <CardText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                      </CardText>
                    </CardBody>
                  </Card>
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1>Virtual Desktop</h1>
            <Row>
              <Col>
                <a href="https://www.coesra.org.au" target="_blank" rel="noopener noreferrer">
                  <Card>
                    <CardBody>
                      <Row>
                        <Col>
                          <CardTitle>
                            <img className="card-logo" src={CoesraLogo} alt="COESRA Logo" />Virtual Desktop
                          </CardTitle>
                          <CardText>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                          </CardText>
                        </Col>
                        <Col>
                          <Row>
                            <Col>
                              <img className="card-logo" src={BiodiverseLogo} alt="Biodiverse Logo" />
                            </Col>
                            <Col>
                              <img className="card-logo" src={QGisLogo} alt="QGIS Logo" />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <img className="card-logo" src={KeplerLogo} alt="Kepler Logo" />
                            </Col>
                            <Col>
                              <img className="card-logo" src={PanoplyLogo} alt="Panoply Logo" />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1>Point-and-click tools</h1>
            <Row>
              <Col>
                <a href="https://spatial.ala.org.au" target="_blank" rel="noopener noreferrer">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        <img className="card-logo" src={ALALogo} alt="ALA Logo" /> ALA Spatial Portal
                      </CardTitle>
                      <CardText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                      </CardText>
                    </CardBody>
                  </Card>
                </a>
              </Col>
              <Col>
                <a href="http://www.bccvl.org.au" target="_blank" rel="noopener noreferrer">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        <img className="card-logo" src={BCCVLLogo} alt="BCCVL Logo" /> BCCVL
                      </CardTitle>
                      <CardText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                      </CardText>
                    </CardBody>
                  </Card>
                </a>
              </Col>
            </Row>
            <Row>
              <Col>
                <a href="http://www.agriculture.gov.au/abares/aclump/multi-criteria-analysis" target="_blank" rel="noopener noreferrer">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        <img className="card-logo" src={MCASSLogo} alt="MCAS-S Logo" /> MCAS-S
                      </CardTitle>
                      <CardText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                      </CardText>
                    </CardBody>
                  </Card>
                </a>
              </Col>
              <Col>
                <a href="https://aurin.org.au" target="_blank" rel="noopener noreferrer">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        <img className="card-logo" src={AURINLogo} alt="AURIN Logo" /> AURIN
                      </CardTitle>
                      <CardText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                      </CardText>
                    </CardBody>
                  </Card>
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsController);
