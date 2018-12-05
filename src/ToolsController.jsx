import React from 'react';
import {
  Container,
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import Rlogo from './assets/images/Rlogo.svg';
import PythonLogo from './assets/images/PythonLogo.png';
import CoesraLogo from './assets/images/CoesraLogo.png';
import ALALogo from './assets/images/ALAlogo.jpg';
import BCCVLLogo from './assets/images/BCCVLlogo.png';
import MCASSLogo from './assets/images/MCASSlogo.jpg';
import AURINLogo from './assets/images/AURINlogo.png';
import { jupyterhub } from './api';
import ToolCard from './tools/ToolCard';

const ToolsController = () => {
  const huburl = jupyterhub.getHubUrl();

  return (
    <Container>
      <Row>
        <Col>
          <h1>Tools</h1>
          <p>
            Here you will find a suite of openly available tools
            that are commonly used in ecosciences.
          </p>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <div className="tools-contents-sidebar">
            <Card>
              <CardBody>
                <ul>
                  <li><a href="#interactive-coding-tools">Interactive Coding Tools</a></li>
                  <li><a href="#virtual-desktop">Virtual Desktop</a></li>
                  <li><a href="#microservices">Microservices</a></li>
                  <li><a href="#point-and-click-tools">Point-and-click Tools</a></li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </Col>
        <Col md={9}>
          <Row>
            <Col>
              <h2 id="interactive-coding-tools" className="tools-section-header">Interactive Coding Tools</h2>
              <p>
                <em>ecocloud</em> gives you access to servers with either R or Python.
                These environments run in your browser and connect to virtual machines
                in the Nectar cloud.
              </p>
              <p>Read more about our servers <a href="https://support.ecocloud.org.au/support/solutions/articles/6000200389-using-jupyter-notebooks" target="_blank" rel="noopener noreferrer">here</a>.</p>
              <Row>
                <Col>
                  <ToolCard
                    title="R (RStudio and Jupyter)"
                    url={`${huburl}/hub/home`}
                    imageSource={Rlogo}
                    imageAltText="R Logo"
                  />
                </Col>
                <Col>
                  <ToolCard
                    title="Scientific Python (SciPy Jupyter)"
                    url={`${huburl}/hub/home`}
                    imageSource={PythonLogo}
                    imageAltText="Python Logo"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2 id="virtual-desktop" className="tools-section-header">Virtual Desktop</h2>
              <p>The virtual desktop service provides you with a computer in the cloud. This service is provided by <a href="https://portal.coesra.org.au/strudel-web/" target="_blank" rel="noopener noreferrer">TERN</a>.</p>
              <Row>
                <Col>
                  <ToolCard
                    title="Virtual Desktop"
                    url="https://portal.coesra.org.au"
                    imageSource={CoesraLogo}
                    imageAltText="CoESRA Logo"
                  />
                </Col>
                <Col />
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2 id="microservices" className="tools-section-header">Microservices</h2>
              <Row>
                <Col>
                  <ToolCard
                    title="Get daily weather values"
                    onLinkClick={(e) => { e.preventDefault(); /* TODO: Implement accordion */ }}
                    imageSource={PythonLogo}
                  />
                </Col>
                <Col>
                  <ToolCard
                    title="Clip data to geographic region"
                    imageSource={PythonLogo}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2 id="point-and-click-tools" className="tools-section-header">Point-and-click Tools</h2>
              <p>
                This is a catalogue of popular tools used in ecosciences.
                These are external tools to the <em>ecocloud</em> Platform and the
                links will take you to the respective websites for each tool.
              </p>
              <p>Think there’s a tool missing? Let us know <a href="https://ecocloud.org.au/contact/" target="_blank" rel="noopener noreferrer" title="Link to contact the ecocloud team">here</a>.</p>
              <Row>
                <Col>
                  <ToolCard
                    title="ALA Spatial Portal"
                    url="https://spatial.ala.org.au"
                    imageSource={ALALogo}
                    imageAltText="ALA Logo"
                  />
                </Col>
                <Col>
                  <ToolCard
                    title="BCCVL"
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
                    url="http://www.agriculture.gov.au/abares/aclump/multi-criteria-analysis"
                    imageSource={MCASSLogo}
                    imageAltText="MCAS-S Logo"
                  />
                </Col>
                <Col>
                  <ToolCard
                    title="AURIN"
                    url="https://aurin.org.au"
                    imageSource={AURINLogo}
                    imageAltText="AURIN Logo"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ToolsController;
