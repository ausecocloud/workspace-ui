import React from 'react';
import { expect } from 'chai';
import Enzyme, { mount, shallow } from 'enzyme';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Adapter from 'enzyme-adapter-react-16';
import { Dashboard } from '../src/Dashboard';

Enzyme.configure({ adapter: new Adapter() });

function setup() {
	const props = {
		stats: {
			used: 4560428,
			quota: 10000000,
		},
		projects: [
			{
				created: "2018-05-17T04:53:09.412430+00:00",
				description: "test",
				modified: "2018-05-17T04:53:09+00:00",
				name: "Test for event"
			}
		],
		isAuthenticated: true,
		user: {
			acr:"1",
			aud:"public",
			auth_time:1526875686,
			azp:"public",
			email:"f.bar@griffith.edu.au",
			exp:1526876588,
			family_name:"Bar",
			given_name:"Foo",
			iat:1526875688,
			iss:"https://auth.ecocloud.org.au/auth/realms/test",
			name:"Foo Bar",
			preferred_username:"foo.b"
		},
		dispatch: () => {
			return Promise.resolve();
		}
	}
	const enzymeWrapper = mount(
			<Router>
				<Dashboard {...props} />
			</Router>
			//
		);

	return {
		props,
		enzymeWrapper
	}
}


describe('Dashboard', () => {
	it('should render at least one div', () => {
		const { enzymeWrapper } = setup()
		const divs = enzymeWrapper.find('div');
		expect(divs.length).to.be.above(0);
    })
})