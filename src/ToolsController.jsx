import React from 'react';
import {
  Container,
  Col,
  Row,
  Card,
  CardBody,
  CardTitle,
  CardText,
} from 'reactstrap';
import Rlogo from './assets/images/Rlogo.svg';
import PythonLogo from './assets/images/PythonLogo.png';
import CoesraLogo from './assets/images/CoesraLogo.png';
import ALALogo from './assets/images/ALAlogo.jpg';
import BCCVLLogo from './assets/images/BCCVLlogo.png';
import QGisLogo from './assets/images/QGisLogo.png';
import PanoplyLogo from './assets/images/PanoplyLogo.png';
import BiodiverseLogo from './assets/images/BiodiverseLogo.png';
import KeplerLogo from './assets/images/KeplerLogo.png';
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
                in the Nectar cloud. Simply choose your preferred language and we’ll do the rest.
              </p>
              <p>Read more about our servers <a href="https://support.ecocloud.org.au/support/solutions/articles/6000200389-using-jupyter-notebooks" target="_blank" rel="noopener noreferrer">here</a>.</p>
              <Row>
                <Col>
                  <ToolCard
                    title="R (RStudio and Jupyter)"
                    description="R is a popular software environment for statistical computing and graphics. This server will run through a JupyterLab interface, with the added ability to run an RStudio server."
                    url={`${huburl}/hub/home`}
                    imageSource={Rlogo}
                    imageAltText="R Logo"
                  />
                </Col>
                <Col>
                  <ToolCard
                    title="Scientific Python (SciPy Jupyter)"
                    description="SciPy is a Python-based ecosystem of open-source software for mathematics, science, and engineering. This server will run through a JupyterLab interface."
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
                  <Card>
                    <CardBody>
                      <Row>
                        <Col>
                          <CardTitle>
                            <img className="card-logo" src={CoesraLogo} alt="COESRA Logo" /><a href="https://portal.coesra.org.au/strudel-web/" target="_blank" rel="noopener noreferrer">Virtual Desktop</a>
                          </CardTitle>
                          <CardText>
                            This Virtual Desktop environment provides a CentOS Linux based
                            virtual desktop environment with tools like QGIS, Kepler Scientific
                            Workflow, KNIME, Panoply, OpenRefine and Biodiverse.
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
                </Col>
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
                    url="#"
                    imageSource={PythonLogo}
                  />
                </Col>
                <Col>
                  <ToolCard
                    title="Clip data to geographic region"
                    url="#"
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
                    description=" The Spatial Portal is a rich research interface to exploring and investigating the data held in the Atlas of Living Australia."
                    url="https://spatial.ala.org.au"
                    imageSource={ALALogo}
                    imageAltText="ALA Logo"
                  />
                </Col>
                <Col>
                  <ToolCard
                    title="BCCVL"
                    description="The Biodiversity and Climate Change Virtual Laboratory (BCCVL) is a “one stop modelling shop” that simplifies the process of biodiversity-climate change modelling. It provides access to curated datasets, modelling workflows and support and training content."
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
                    description="The Multi-Criteria Analysis Shell for Spatial Decision Support (MCAS-S) is a tool designed for decision-makers. It shows transparently how mapped information can be combined to meet an objective. MCAS-S allows stakeholders to see the effects that their decisions may have. Currently, MCAS-S is only available as a software download, however we’re working with the MCAS-S team to bring this into a cloud solution."
                    url="http://www.agriculture.gov.au/abares/aclump/multi-criteria-analysis"
                    imageSource={MCASSLogo}
                    imageAltText="MCAS-S Logo"
                  />
                </Col>
                <Col>
                  <ToolCard
                    title="AURIN"
                    description="AURIN provides urban and built environment researchers with access to diverse sources of data, data integration capabilities, and capability for interrogating those data to make informed decisions about urban environments based on realistic scenarios and evidence-based analysis."
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
