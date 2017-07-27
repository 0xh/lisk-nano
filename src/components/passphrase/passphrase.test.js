import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';
import Passphrase from './passphrase';
import InfoParagraph from '../infoParagraph';
import PassphraseGenerator from './passphraseGenerator';
import PassphraseConfirmator from './passphraseConfirmator';

chai.use(sinonChai);

describe('ForgedBlocks', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Passphrase />);
  });

  it('should render 2 buttons', () => {
    expect(wrapper.find('button')).to.have.lengthOf(2);
  });

  it('should intially render InfoParagraph', () => {
    expect(wrapper.find(InfoParagraph)).to.have.lengthOf(1);
  });

  it('should render PassphraseGenerator component if step is equal info', () => {
    wrapper.setState({ currentStep: 'generate' });
    expect(wrapper.find(PassphraseGenerator)).to.have.lengthOf(1);
  });

  it('should render PassphraseConfirmator component if step is equal confirm', () => {
    wrapper.setState({
      currentStep: 'confirm',
      passphrase: 'survey stereo pool fortune oblige slight gravity goddess mistake sentence anchor pool',
    });
    expect(wrapper.find(PassphraseConfirmator)).to.have.lengthOf(1);
  });
});
