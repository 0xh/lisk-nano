import React from 'react';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import Checkbox, { VoteCheckbox } from './voteCheckbox';
import styles from './voting.css';

chai.use(sinonChai);
const mockStore = configureStore();

describe('Checkbox', () => {
  const props = {
    store: mockStore({ runtime: {} }),
    data: {
      username: 'yashar',
      address: 'address 1',
    },
    styles,
    pending: false,
    value: true,
    addToVoteList: () => true,
    removeFromVoteList: () => true,
  };
  it('it should expose onAccountUpdated as function', () => {
    const wrapper = mount(<Checkbox {...props} />);
    expect(typeof wrapper.props().addToVoteList).to.equal('function');
  });

  it('it should expose removeFromVoteList as function', () => {
    const wrapper = mount(<Checkbox {...props} />);
    expect(typeof wrapper.props().removeFromVoteList).to.equal('function');
  });
});
describe('VoteCheckbox', () => {
  let wrapper;
  const props = {
    store: mockStore({ runtime: {} }),
    data: {
      username: 'yashar',
      address: 'address 1',
    },
    styles,
    pending: false,
    value: true,
    addToVoteList: sinon.spy(),
    removeFromVoteList: sinon.spy(),
  };

  beforeEach(() => {
    wrapper = mount(<VoteCheckbox {...props} />);
  });

  it('should render a Spinner When pending is true', () => {
    wrapper.setProps({ pending: true });
    expect(wrapper.find('Spinner').exists()).to.be.equal(true);
  });

  it('should render a Checkbox is false', () => {
    expect(wrapper.find('Checkbox').exists()).to.be.equal(true);
  });

  it('should Checkbox change event should call this.props.addToVoteList when value is true', () => {
    wrapper.instance().toggle(props.data, true);
    expect(props.addToVoteList).to.have.been.calledWith(props.data);
  });

  it('should Checkbox change event should call this.props.removeFromVoteList when value is false', () => {
    wrapper.instance().toggle(props.data, false);
    expect(props.removeFromVoteList).to.have.been.calledWith(props.data);
  });
});
