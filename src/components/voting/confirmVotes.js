import React from 'react';
import { connect } from 'react-redux';
import Input from 'react-toolbox/lib/input';
import { votePlaced } from '../../actions/voting';
import InfoParagraph from '../infoParagraph';
import ActionBar from '../actionBar';
import Fees from '../../constants/fees';
import Autocomplete from './voteAutocomplete';

export class ConfirmVotes extends React.Component {
  constructor() {
    super();
    this.state = {
      secondSecret: '',
    };
  }

  confirm() {
    const secondSecret = this.state.secondSecret.length === 0 ? null : this.state.secondSecret;

    // fire first action
    this.props.votePlaced({
      activePeer: this.props.activePeer,
      account: this.props.account,
      votedList: this.props.votedList,
      unvotedList: this.props.unvotedList,
      secondSecret,
    });
  }

  setSecondPass(name, value) {
    this.setState({ [name]: value });
  }

  render() {
    const secondPassphrase = this.props.account.secondSignature === 1 ?
      <Input type='text' label='Second Passphrase' name='secondSecret'
        className='secondSecret second-passphrase' value={this.state.secondSecret}
        onChange={this.setSecondPass.bind(this, 'secondSecret')}/> : null;

    return (
      <article>
        <Autocomplete voted={this.props.voted} />
        {secondPassphrase}

        <InfoParagraph>
          <div >
            You can select up to 33 delegates in one voting turn.
          </div>
          You can vote for up to 101 delegates in total.
        </InfoParagraph>

        <ActionBar
          secondaryButton={{
            onClick: this.props.closeDialog,
          }}
          primaryButton={{
            label: 'Confirm',
            fee: Fees.vote,
            disabled: (
              this.props.votedList.length === 0 &&
              this.props.unvotedList.length === 0),
            onClick: this.confirm.bind(this),
          }} />
      </article>
    );
  }
}


const mapStateToProps = state => ({
  votedList: state.voting.votedList,
  unvotedList: state.voting.unvotedList,
  account: state.account,
  activePeer: state.peers.data,
});

const mapDispatchToProps = dispatch => ({
  votePlaced: data => dispatch(votePlaced(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmVotes);
