import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount, shallow } from 'enzyme';
import Lisk from 'lisk-js';
import Login from './login';

describe('Login', () => {
  let wrapper;
  // Mocking store
  const account = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-nano',
  };

  const props = {
    peers: {},
    account,
    history: {},
    onAccountUpdated: () => {},
    setActiveDialog: spy(),
    activePeerSet: (network) => {
      props.peers.data = Lisk.api(network);
    },
  };
  props.spyActivePeerSet = spy(props.activePeerSet);

  describe('Generals', () => {
    beforeEach(() => {
      wrapper = mount(<Login {...props} />);
    });

    it('should render a form tag', () => {
    });

    it('should render address input if state.network === 2', () => {
      wrapper.setState({ network: 2 });
      expect(wrapper.find('.address')).to.have.lengthOf(1);
    });

    it('should show error about passphrase length if passphrase is have wrong length', () => {
      const passphrase = 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin';
      const expectedError = 'Passphrase should have 12 words, entered passphrase has 11';
      wrapper.find('.passphrase input').simulate('change', { target: { value: passphrase } });
      expect(wrapper.find('.passphrase').text()).to.contain(expectedError);
    });

    it('should show error about incoret word  and show similar word if passphrase is have word not from dictionary', () => {
      const passphrase = 'rexsipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit';
      const expectedError = 'Word "rexsipe" is not on the passphrase Word List. Most similar word on the list is "recipe"';
      wrapper.find('.passphrase input').simulate('change', { target: { value: passphrase } });
      expect(wrapper.find('.passphrase').text()).to.contain(expectedError);
    });

    it('should show error about incoret word if passphrase is have word not from dictionary', () => {
      const passphrase = 'sdasd bomb asset salon coil symbol tiger engine assist pact pumpkin visit';
      const expectedError = 'Word "sdasd" is not on the passphrase Word List.';
      wrapper.find('.passphrase input').simulate('change', { target: { value: passphrase } });
      expect(wrapper.find('.passphrase').text()).to.contain(expectedError);
    });

    it('should show error about invalid passhprase if it is incorrect', () => {
      const passphrase = 'recipe bomb asset salon coil symbol apple engine assist pact pumpkin visit';
      const expectedError = 'Passphrase is not valid';
      wrapper.find('.passphrase input').simulate('change', { target: { value: passphrase } });
      expect(wrapper.find('.passphrase').text()).to.contain(expectedError);
    });

    it('should show call props.setActiveDialog when "new account" button is clicked', () => {
      wrapper.find('.new-account-button').simulate('click');
      expect(props.setActiveDialog).to.have.been.calledWith();
    });
  });

  describe('componentDidMount', () => {
    it('calls devPreFill', () => {
      const spyFn = spy(Login.prototype, 'devPreFill');
      mount(<Login {...props} />);
      expect(spyFn).to.have.been.calledWith();
    });
  });

  describe('componentDidUpdate', () => {
    const address = 'http:localhost:8080';
    props.account = { address: 'dummy' };
    props.history = {
      replace: spy(),
      location: {
        search: '',
      },
    };

    it('calls this.props.history.replace(\'/main/transactions\')', () => {
      wrapper = mount(<Login {...props} />);
      wrapper.setProps(props);
      expect(props.history.replace).to.have.been.calledWith('/main/transactions');
    });

    it('calls this.props.history.replace with referrer address', () => {
      props.history.location.search = '?referrer=/main/voting';
      wrapper = mount(<Login {...props}/>);
      expect(props.history.replace).to.have.been.calledWith('/main/voting');
    });

    it('call this.props.history.replace with "/main/transaction" if referrer address is "/main/forging" and account.isDelegate === false', () => {
      props.history.location.search = '?referrer=/main/forging';
      props.account.isDelegate = false;
      wrapper = mount(<Login {...props} />);
      expect(props.history.replace).to.have.been.calledWith('/main/transactions');
    });

    it('calls localStorage.setItem(\'address\', address) if this.state.address', () => {
      const spyFn = spy(localStorage, 'setItem');
      wrapper = mount(<Login {...props} />);
      wrapper.setState({ address });
      wrapper.setProps(props);
      expect(spyFn).to.have.been.calledWith('address', address);

      spyFn.restore();
      localStorage.removeItem('address');
    });
  });

  describe('validateUrl', () => {
    beforeEach('', () => {
      wrapper = shallow(<Login {...props} />);
    });

    it('should set address and addressValidity="" for a valid address', () => {
      const validURL = 'http://localhost:8080';
      const data = wrapper.instance().validateUrl(validURL);
      const expectedData = {
        address: validURL,
        addressValidity: '',
      };
      expect(data).to.deep.equal(expectedData);
    });

    it('should set address and addressValidity correctly event without http', () => {
      const validURL = '127.0.0.1:8080';
      const data = wrapper.instance().validateUrl(validURL);
      const expectedData = {
        address: validURL,
        addressValidity: '',
      };
      expect(data).to.deep.equal(expectedData);
    });

    it('should set address and addressValidity="URL is invalid" for a valid address', () => {
      const validURL = 'http:localhost:8080';
      const data = wrapper.instance().validateUrl(validURL);
      const expectedData = {
        address: validURL,
        addressValidity: 'URL is invalid',
      };
      expect(data).to.deep.equal(expectedData);
    });
  });

  describe('changeHandler', () => {
    it('call setState with matching data', () => {
      wrapper = shallow(<Login {...props} />);
      const key = 'network';
      const value = 0;
      const spyFn = spy(Login.prototype, 'setState');
      wrapper.instance().changeHandler(key, value);
      expect(spyFn).to.have.been.calledWith({ [key]: value });
    });
  });

  describe('onLoginSubmission', () => {
    it.skip('it should call activePeerSet', () => {
      wrapper = shallow(<Login {...props} />);
      wrapper.instance().onLoginSubmission();
      expect(wrapper.props().spyActivePeerSet).to.have.been.calledWith();
    });
  });

  describe.skip('devPreFill', () => {
    it('should call validateUrl', () => {
      const spyFn = spy(Login.prototype, 'validateUrl');

      mount(<Login {...props} />);
      expect(spyFn).to.have.been.calledWith();
    });

    it('should set state with correct network index and passphrase', () => {
      const spyFn = spy(Login.prototype, 'validateUrl');
      const passphrase = 'Test Passphrase';
      localStorage.setItem('address', 'http:localhost:4000');
      localStorage.setItem('passphrase', passphrase);

      // for invalid address, it should set network to 0
      mount(<Login {...props} />);
      expect(spyFn).to.have.been.calledWith({
        passphrase,
        network: 0,
      });

      Login.prototype.validateUrl.restore();
    });

    it('should set state with correct network index and passphrase', () => {
      const spyFn = spy(Login.prototype, 'validateUrl');
      // for valid address should set network to 2
      const passphrase = 'Test Passphrase';
      localStorage.setItem('passphrase', passphrase);
      localStorage.setItem('address', 'http:localhost:4000');
      mount(<Login {...props} />);
      expect(spyFn).to.have.been.calledWith({
        passphrase,
        network: 2,
      });

      Login.prototype.validateUrl.restore();
    });
  });
});
