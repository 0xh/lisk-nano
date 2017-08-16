import React from 'react';
import { Card } from 'react-toolbox/lib/card';
import Waypoint from 'react-waypoint';
import ForgingTitle from './forgingTitle';
import DelegateStats from './delegateStats';
import ForgingStats from './forgingStats';
import ForgedBlocks from './forgedBlocks';

class ForgingComponent extends React.Component {
  loadStats(key, startMoment) {
    this.props.onForgingStatsUpdate(this.props.peers.data, key,
      startMoment, this.props.account.publicKey);
  }

  loadForgedBlocks(activePeer, limit, offset) {
    this.props.onForgedBlocksLoaded(this.props.peers.data, limit,
      offset, this.props.account.publicKey);
  }

  render() {
    const { account, statistics, forgedBlocks } = this.props;
    return (
      <Card style={{ padding: 8 }}>
        {account && account.isDelegate ?
          <div>
            <ForgingTitle account={account} statistics={statistics}
              loadStats={this.loadStats.bind(this)} />
            <br />
            <ForgingStats account={account} statistics={statistics}
              loadStats={this.loadStats.bind(this)} />
            <br />
            <DelegateStats delegate={account.delegate} />
            <br />
            <ForgedBlocks forgedBlocks={forgedBlocks} />
            <Waypoint onEnter={() => this.loadForgedBlocks(
              20,
              forgedBlocks.length,
            ) } />
          </div> :
          null
        }
        {account && account.delegate && !account.isDelegate ?
          <p>
            You need to become a delegate to start forging.
            If you already registered to become a delegate,
            your registration hasn't been processed, yet.
          </p> :
          null
        }
      </Card>
    );
  }
}

export default ForgingComponent;
