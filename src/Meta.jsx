import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';


export default class Meta extends React.PureComponent {
  static propTypes = {
    pagetitle: PropTypes.string.isRequired,
    pagedesc: PropTypes.string.isRequired,
  }

  render() {
    const { pagetitle, pagedesc } = this.props;

    const pageMeta = (
      <Helmet>
        <meta charSet="utf-8" />
        <title>ecocloud {pagetitle}</title>
        <meta name="description" content={pagedesc} />
      </Helmet>
    );

    return pageMeta;
  }
}
