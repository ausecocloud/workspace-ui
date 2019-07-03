import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Row,
  Col,
  Button,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

function IntroBlock({ onLaunchLogin }) {
  return (
    <Container className="intro-block">
      <Row>
        <Col lg={4} className="intro-desc-text-wrapper">
          <div>
            <h1>
              Welcome to <em>ecocloud</em>
            </h1>
            <p>
              <em>ecocloud</em> is a free online environment that requires no
              setup and runs entirely in the cloud. You can write, edit and run
              code, save and share your analyses through GitHub or Google Drive,
              and access powerful computing resources, all for free from your
              browser!
            </p>
            <p>
              <Button color="primary" onClick={onLaunchLogin}>
                Sign in to get started{' '}
                <FontAwesomeIcon icon={faArrowCircleRight} />
              </Button>
            </p>
          </div>
        </Col>
        <Col lg={8}>
          <Row noGutters className="features-panel-wrapper">
            <Col xs={12} lg={6} className="features-panel-col">
              <div>
                <h4>Cloud based processing</h4>
                <img
                  src="https://ecocloud.org.au/wp-content/uploads/2019/01/coding-icon_8.jpg"
                  alt="Icon with two windows with foreground window containing code"
                />
                <p>
                  Big data needs big processing power. We use cloud based
                  processing so you can save space.
                </p>
              </div>
              <div>
                <h4>Multi-code language</h4>
                <img
                  src="https://ecocloud.org.au/wp-content/uploads/2019/01/coding-icon_1.jpg"
                  alt="Icon derived from Python language logo"
                />
                <p>
                  We offer either Python or R (and RStudio) platforms to write,
                  edit and run your code.
                </p>
              </div>
              <div>
                <h4>Easy access</h4>
                <img
                  src="https://ecocloud.org.au/wp-content/uploads/2019/01/coding-icon_3.jpg"
                  alt="Icon with lightbulb in front of computer display"
                />
                <p>
                  Login through your Australian University account. Otherwise,
                  it&apos;s free to make a new account.
                </p>
              </div>
            </Col>
            <Col xs={12} lg={6} className="features-panel-col">
              <div>
                <h4>Integration</h4>
                <img
                  src="https://ecocloud.org.au/wp-content/uploads/2019/01/coding-icon_5.jpg"
                  alt="Icon with an abstract representation of a system with multiple connections"
                />
                <p>
                  Connect easily with existing code and analyses hosted
                  externally, such as GitHub repositories.
                </p>
              </div>
              <div>
                <h4>Use existing datasets</h4>
                <img
                  src="https://ecocloud.org.au/wp-content/uploads/2019/01/coding-icon_2.jpg"
                  alt="Icon with two sheets of paper representing documents"
                />
                <p>
                  Take your analyses further by integrating publicly available
                  datasets to your collected data.
                </p>
              </div>
              <div>
                <h4>Ongoing support</h4>
                <img
                  src="https://ecocloud.org.au/wp-content/uploads/2019/01/coding-icon_4.jpg"
                  alt="Icon with a representation of a pencil completing a form"
                />
                <p>
                  We are a helpful team and can assist you with your code,
                  analyses and teaching materials.
                </p>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <div />
    </Container>
  );
}

IntroBlock.propTypes = {
  onLaunchLogin: PropTypes.func,
};

IntroBlock.defaultProps = {
  onLaunchLogin: () => {},
};

export default IntroBlock;
