import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render, configure } from 'enzyme';
import { spy } from 'sinon';
import Adapter from 'enzyme-adapter-react-16';

import { Dashboard } from '../src/Dashboard';

configure({ adapter: new Adapter() });

spy(Dashboard.prototype, 'componentDidMount');

describe('<Dashboard />', () => {
  it('calls componentDidMount', () => {
    const wrapper = mount(<Dashboard />);
    expect(Dashboard.prototype.componentDidMount.calledOnce).to.equal(true);
  });
});