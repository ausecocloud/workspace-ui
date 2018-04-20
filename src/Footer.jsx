import React from 'react';

export default class Footer extends React.Component {
  render() {
    const footerMain = (
      <footer id="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h3>Project Partners</h3>
              <div className="row">
                <div className="col-md-6">
                  <ul>
                    <li><a href="http://fennerschool.anu.edu.au/" target="_blank" rel="noopener noreferrer" title="Fennel School, ANU">Fennel School, ANU</a></li>
                    <li><a href="https://www.ala.org.au/" target="_blank" rel="noopener noreferrer" title="Atlas of Living Australia">Atlas of Living Australia</a></li>
                    <li><a href="http://www.plantphenomics.org.au/" target="_blank" rel="noopener noreferrer" title="Australian Plant Phenomics Facility">Australian Plant Phenomics Facility</a></li>
                    <li><a href="https://www.csiro.au/en/Research/LWF" target="_blank" rel="noopener noreferrer" title="CSIRO Land and Water">CSIRO Land and Water</a></li>
                    <li><a href="https://www.griffith.edu.au/" target="_blank" rel="noopener noreferrer" title="Griffith University">Griffith University</a></li>
                    <li><a href="http://www.bccvl.org.au/" target="_blank" rel="noopener noreferrer" title="BCCVL">BCCVL</a></li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul>
                    <li><a href="http://www.agriculture.gov.au/abares" target="_blank" rel="noopener noreferrer" title="Department of Agriculture, ABARES">Department of Agriculture, ABARES</a></li>
                    <li><a href="http://www.environment.gov.au/" target="_blank" rel="noopener noreferrer" title="Department of the Environment and Energy">Department of the Environment and Energy</a></li>
                    <li><a href="https://www.ersa.edu.au/" target="_blank" rel="noopener noreferrer" title="eRSA">eRSA</a></li>
                    <li><a href="http://www.tern.org.au/" target="_blank" rel="noopener noreferrer" title="TERN">TERN</a></li>
                    <li><a href="https://www.qcif.edu.au/" target="_blank" rel="noopener noreferrer" title="QCIF">QCIF</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <h3>Funded By</h3>
              <ul>
                <li><a href="https://www.ands.org.au/about-us/ands-nectar-rds" target="_blank" rel="noopener noreferrer" title="The ANDS, Nectar and RDS partnership">The ANDS, Nectar and RDS partnership</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h3>Tutorials &amp; Support</h3>
              <p>Browse our support articles and join our community at <a href="http://support.ecocloud.org.au/" target="_blank" rel="noopener noreferrer" title="Visit ecocloud helpdesk">support.ecocloud.org.au</a></p>
            </div>
          </div>
        </div>
      </footer>
    );

    return footerMain;
  }
}
