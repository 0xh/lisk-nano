import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import PassphraseInput from './index';

describe('PassphraseInput', () => {
  let wrapper;
  let props;
  let onChangeSpy;

  beforeEach('', () => {
    props = {
      error: '',
      value: '',
      onChange: () => {},
    };
    onChangeSpy = spy(props, 'onChange');
    wrapper = mount(<PassphraseInput {...props} />);
  });

  afterEach('', () => {
    onChangeSpy.restore();
  });

  it('should call props.onChange with error=undefined if a valid passphrase is entered', () => {
    const passphrase = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble';
    wrapper.find('input').simulate('change', { target: { value: passphrase } });
    expect(wrapper.props().onChange).to.have.been.calledWith(passphrase, undefined);
  });

  it('should call props.onChange with error="Required" if an empty passphrase is entered', () => {
    const passphrase = '';
    wrapper.find('input').simulate('change', { target: { value: passphrase } });
    expect(wrapper.props().onChange).to.have.been.calledWith(passphrase, 'Required');
  });

  const ONLY_ONE_WORD_ERROR = 'Passphrase should have 12 words, entered passphrase has 1';
  it(`should call props.onChange with error="${ONLY_ONE_WORD_ERROR}" if an "test" passphrase is entered`, () => {
    const passphrase = 'test';
    wrapper.find('input').simulate('change', { target: { value: passphrase } });
    expect(wrapper.props().onChange).to.have.been.calledWith(passphrase, ONLY_ONE_WORD_ERROR);
  });

  const INVALID_WORD = 'INVALID_WORD';
  const INVALID_WORD_ERROR = `Word "${INVALID_WORD}" is not on the passphrase Word List.`;
  it(`should call props.onChange with error='${INVALID_WORD_ERROR}' if a passphrase with an invalid word is entered`, () => {
    const passphrase = `${INVALID_WORD} stock borrow episode laundry kitten salute link globe zero feed marble`;
    wrapper.find('input').simulate('change', { target: { value: passphrase } });
    expect(wrapper.props().onChange).to.have.been.calledWith(passphrase, INVALID_WORD_ERROR);
  });

  const SIMILAR_WORD_ERROR = 'Word "wagot" is not on the passphrase Word List. Most similar word on the list is "wagon"';
  it(`should call props.onChange with error='${SIMILAR_WORD_ERROR}' if an passphrase with a typo is entered`, () => {
    const passphrase = 'wagot stock borrow episode laundry kitten salute link globe zero feed marble';
    wrapper.find('input').simulate('change', { target: { value: passphrase } });
    expect(wrapper.props().onChange).to.have.been.calledWith(passphrase, SIMILAR_WORD_ERROR);
  });

  const NOT_VALID_ERROR = 'Passphrase is not valid';
  it(`should call props.onChange with error="${NOT_VALID_ERROR}" if an otherwise invalid passphrase is entered`, () => {
    const passphrase = 'stock wagon borrow episode laundry kitten salute link globe zero feed marble';
    wrapper.find('input').simulate('change', { target: { value: passphrase } });
    expect(wrapper.props().onChange).to.have.been.calledWith(passphrase, NOT_VALID_ERROR);
  });

  it('should allow to change the input field to type="text" and back', () => {
    expect(wrapper.find('input').props().type).to.equal('password');
    wrapper.find('.show-passphrase-toggle').simulate('click');
    expect(wrapper.find('input').props().type).to.equal('text');
    wrapper.find('.show-passphrase-toggle').simulate('click');
    expect(wrapper.find('input').props().type).to.equal('password');
  });
});
