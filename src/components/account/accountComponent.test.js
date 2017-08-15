import React from 'react';
import chai, { expect } from 'chai';
import sinon, { spy, mock } from 'sinon';
import sinonChai from 'sinon-chai';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as accountApi from '../../utils/api/account';
import store from '../../store';
import AccountComponent from './accountComponent';
import ClickToSend from '../send/clickToSend';

chai.use(sinonChai);

describe('AccountComponent', () => {
  let props;

  beforeEach(() => {
    props = {
      onActivePeerUpdated: sinon.spy(),
      onAccountUpdated: sinon.spy(),
      peers: {
        status: {
          online: false,
        },
        data: {
          currentPeer: 'localhost',
          port: 4000,
          options: {
            name: 'Custom Node',
          },
        },
      },
      account: {
        isDelegate: false,
        address: '16313739661670634666L',
        username: 'lisk-nano',
        balance: 1e8,
      },
    };
  });

  it('should render 3 article tags', () => {
    const wrapper = shallow(<AccountComponent {...props} />);
    expect(wrapper.find('article')).to.have.lengthOf(3);
  });

  it('depicts being online when peers.status.online is true', () => {
    props.peers.status.online = true;
    const wrapper = shallow(<AccountComponent {...props} />);
    const expectedValue = 'check';
    expect(wrapper.find('.material-icons').text()).to.be.equal(expectedValue);
  });

  it('should render balance with ClickToSend component', () => {
    const wrapper = mount(<Provider store={store}>
      <AccountComponent {...props} />
    </Provider>);
    expect(wrapper.find('.balance').find(ClickToSend)).to.have.lengthOf(1);
  });
});
