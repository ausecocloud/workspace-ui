import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Meta from '../src/Meta';
import { Helmet } from 'react-helmet';

describe('<Meta />', () => {
	it('renders one <Helmet /> component', () => {
		const wrapper = shallow(<Meta pagetitle="test" pagedesc="test desc" />);
		expect(wrapper.find(Helmet)).to.have.length(1);
	});
});