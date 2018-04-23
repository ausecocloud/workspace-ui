import React from 'react';
import { Helmet } from 'react-helmet';

export default class Meta extends React.PureComponent {
  render() {
    const meta = this.props;

    const pageMeta = (
      <Helmet>
        <meta charSet="utf-8" />
        <title>ecocloud {meta.pagetitle}</title>
        <meta name="description" content={meta.pagedesc} />
      </Helmet>
    );

    return pageMeta;
  }
}
