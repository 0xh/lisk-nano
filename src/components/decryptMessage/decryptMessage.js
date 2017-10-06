import React from 'react';
import Input from 'react-toolbox/lib/input';
import Lisk from 'lisk-js';
import SignVerifyResult from '../signVerifyResult';
import ActionBar from '../actionBar';


class DecryptMessage extends React.Component {
  constructor() {
    super();
    this.state = {
      result: '',
      nonce: {},
      message: {},
      senderPublicKey: {},
    };
  }

  handleChange(name, value, error) {
    this.setState({
      [name]: {
        value,
        error,
      },
    });
  }

  decrypt() {
    const decryptedMessage = Lisk.crypto.decryptMessageWithSecret(
      this.state.message.value,
      this.state.nonce.value,
      this.props.account.passphrase,
      this.state.senderPublicKey.value);
    const result = [
      '-----DECRYPTED MESSAGE-----',
      decryptedMessage.encryptedMessage,
    ].join('\n');
    this.setState({ result/* , resultIsShown: false */ });
  }

  showResult(event) {
    event.preventDefault();
    const copied = this.props.copyToClipboard(this.state.result, {
      message: this.props.t('Press #{key} to copy'),
    });
    if (copied) {
      this.props.successToast({ label: this.props.t('Result copied to clipboard') });
    }
    this.setState({ resultIsShown: true });
  }

  render() {
    return (
      <div className='sign-message'>
        <form onSubmit={this.showResult.bind(this)}>
          <section>
            <Input className='sender-public-key' label={this.props.t('Sender PublicKey')}
              autoFocus={true}
              value={this.state.senderPublicKey.value}
              onChange={this.handleChange.bind(this, 'senderPublicKey')} />

            <Input className='nonce' label={this.props.t('Nonce')}
              autoFocus={true}
              value={this.state.nonce.value}
              onChange={this.handleChange.bind(this, 'nonce')} />
            <Input className='message' multiline label={this.props.t('Message')}
              autoFocus={true}
              value={this.state.message.value}
              onChange={this.handleChange.bind(this, 'message')} />

          </section>
          {this.state.resultIsShown ?
            <SignVerifyResult result={this.state.result} title={this.props.t('Result')} /> :
            <ActionBar
              secondaryButton={{
                onClick: this.props.closeDialog,
              }}
              primaryButton={{
                label: this.props.t('decrypt'),
                className: 'sign-button',
                type: 'submit',
                // disabled: (this.state.message.value ||  this.state.message.value),
                onClick: this.decrypt.bind(this),
              }} />
          }
        </form>
      </div>
    );
  }
}

export default DecryptMessage;
