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
import ToolCard from "./tools/ToolCard";

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
                <ToolCard
                  title="RStudio & R Jupyter"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
                  url={`${huburl}/hub/home`}
                  imageSource={Rlogo}
                  imageAltText="R Logo"
                />
              </Col>
              <Col>
                <ToolCard
                  title="SciPy Jupyter"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
                  url={`${huburl}/hub/home`}
                  imageSource={JupyterLogo}
                  imageAltText="Jupyter Logo"
                />
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
                <ToolCard
                  title="ALA Spatial Portal"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
                  url="https://spatial.ala.org.au"
                  imageSource={ALALogo}
                  imageAltText="ALA Logo"
                />
              </Col>
              <Col>
                <ToolCard
                  title="BCCVL"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
                  url="http://www.bccvl.org.au"
                  imageSource={BCCVLLogo}
                  imageAltText="BCCVL Logo"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ToolCard
                  title="MCAS-S"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
                  url="http://www.agriculture.gov.au/abares/aclump/multi-criteria-analysis"
                  imageSource={MCASSLogo}
                  imageAltText="MCAS-S Logo"
                />
              </Col>
              <Col>
                <ToolCard
                  title="AURIN"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
                  url="https://aurin.org.au"
                  imageSource={AURINLogo}
                  imageAltText="AURIN Logo"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsController);
