import React from 'react';
import { Container, Row, Col } from 'reactstrap';

export default class Footer extends React.Component {
  render() {
    const footerMain = (
      <footer id="footer">
        <Container>
          <Row>
            <Col md="6">
              <h3>Project Partners</h3>
              <Row>
                <Col md="6">
                  <ul>
                    <li><a href="http://fennerschool.anu.edu.au/" target="_blank" rel="noopener noreferrer" title="Fenner School, ANU">Fenner School, ANU</a></li>
                    <li><a href="https://www.ala.org.au/" target="_blank" rel="noopener noreferrer" title="Atlas of Living Australia">Atlas of Living Australia</a></li>
                    <li><a href="http://www.plantphenomics.org.au/" target="_blank" rel="noopener noreferrer" title="Australian Plant Phenomics Facility">Australian Plant Phenomics Facility</a></li>
                    <li><a href="https://www.csiro.au/en/Research/LWF" target="_blank" rel="noopener noreferrer" title="CSIRO Land and Water">CSIRO Land and Water</a></li>
                    <li><a href="https://www.griffith.edu.au/" target="_blank" rel="noopener noreferrer" title="Griffith University">Griffith University</a></li>
                    <li><a href="http://www.bccvl.org.au/" target="_blank" rel="noopener noreferrer" title="BCCVL">BCCVL</a></li>
                  </ul>
                </Col>
                <Col md="6">
                  <ul>
                    <li><a href="http://www.agriculture.gov.au/abares" target="_blank" rel="noopener noreferrer" title="Department of Agriculture, ABARES">Department of Agriculture, ABARES</a></li>
                    <li><a href="http://www.environment.gov.au/" target="_blank" rel="noopener noreferrer" title="Department of the Environment and Energy">Department of the Environment and Energy</a></li>
                    <li><a href="https://www.ersa.edu.au/" target="_blank" rel="noopener noreferrer" title="eRSA">eRSA</a></li>
                    <li><a href="http://www.tern.org.au/" target="_blank" rel="noopener noreferrer" title="TERN">TERN</a></li>
                    <li><a href="https://www.qcif.edu.au/" target="_blank" rel="noopener noreferrer" title="QCIF">QCIF</a></li>
                  </ul>
                </Col>
              </Row>
            </Col>
            <Col md="3">
              <h3>Funded By</h3>
              <ul>
                <li><a href="https://ardc.edu.au/" target="_blank" rel="noopener noreferrer" title="Australian Research Data Commons">Australian Research Data Commons</a></li>
              </ul>
            </Col>
            <Col md="3">
              <h3>Documentation</h3>
              <ul>
                <li><a href="#" target="_blank" rel="noopener noreferrer" title="Tutorials">Tutorials</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer" title="Support articles">Support articles</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer" title="FAQ">FAQ</a></li>
              </ul>
              <h3>Support</h3>
              <ul>
                <li><a href="https://www.ecocloud.org.au/contact/" target="_blank" rel="noopener noreferrer" title="Contact us">Contact us</a></li>
              </ul>
            </Col>
          </Row>
        </Container>
      </footer>
    );

    return footerMain;
  }
}
