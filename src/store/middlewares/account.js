import { getAccountStatus, getAccount, transactions } from '../../utils/api/account';
import { accountUpdated, accountLoggedIn } from '../../actions/account';
import { transactionsUpdated } from '../../actions/transactions';
import { activePeerUpdate } from '../../actions/peers';
import { clearVoteLists } from '../../actions/voting';
import actionTypes from '../../constants/actions';
import { fetchAndUpdateForgedBlocks } from '../../actions/forging';
import { getDelegate } from '../../utils/api/delegate';
import transactionTypes from '../../constants/transactionTypes';

const updateAccountData = (store) => { // eslint-disable-line
  const { peers, account } = store.getState();

  getAccount(peers.data, account.address).then((result) => {
    if (result.balance !== account.balance) {
      const maxBlockSize = 25;
      transactions(peers.data, account.address, maxBlockSize)
        .then(response => store.dispatch(transactionsUpdated({
          confirmed: response.transactions,
          count: parseInt(response.count, 10),
        })));
      if (account.isDelegate) {
        store.dispatch(fetchAndUpdateForgedBlocks({
          activePeer: peers.data,
          limit: 10,
          offset: 0,
          generatorPublicKey: account.publicKey,
        }));
      }
    }
    store.dispatch(accountUpdated(result));
  });

  return getAccountStatus(peers.data).then(() => {
    store.dispatch(activePeerUpdate({ online: true }));
  }).catch((res) => {
    store.dispatch(activePeerUpdate({ online: false, code: res.error.code }));
  });
};

const getRecentTransactionOfType = (transactionsList, type) => (
  transactionsList.filter(transaction => (
    transaction.type === type &&
    // limit the number of confirmations to 5 to not fire each time there is another new transaction
    // theoretically even less then 5, but just to be on the safe side
    transaction.confirmations < 5))[0]
);

const delegateRegistration = (store, action) => {
  const delegateRegistrationTx = getRecentTransactionOfType(
    action.data.confirmed, transactionTypes.registerDelegate);
  const state = store.getState();

  if (delegateRegistrationTx) {
    getDelegate(state.peers.data, state.account.publicKey)
      .then((delegateData) => {
        store.dispatch(accountLoggedIn(Object.assign({},
          { delegate: delegateData.delegate, isDelegate: true })));
      });
  }
};

const votePlaced = (store, action) => {
  const voteTransaction = getRecentTransactionOfType(
    action.data.confirmed, transactionTypes.vote);

  if (voteTransaction) {
    store.dispatch(clearVoteLists());
  }
};

const accountMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.metronomeBeat:
      updateAccountData(store);
      break;
    case actionTypes.transactionsUpdated:
      delegateRegistration(store, action);
      votePlaced(store, action);
      break;
    default: break;
  }
};

export default accountMiddleware;
