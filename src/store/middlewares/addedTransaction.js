import actionTypes from '../../constants/actions';
import { successAlertDialogDisplayed } from '../../actions/dialog';

const addedTransactionMiddleware = store => next => (action) => {
  next(action);
  if (action.type === actionTypes.transactionAdded) {
    let text;
    switch (action.data.type) {
      case 1:
        // second signature: 1
        text = 'Second passphrase registration was successfully submitted. It can take several seconds before it is processed.';
        break;
      case 2:
        // register as delegate: 2
        text = `Delegate registration was successfully submitted with username: "${action.data.username}". It can take several seconds before it is processed.`;
        break;
      case 3:
        // Vote: 3
        text = 'Your votes were successfully submitted. It can take several seconds before they are processed.';
        break;
      default:
        // send: undefined
        text = `Your transaction of ${action.data.amount} LSK to ${action.data.recipientId} was accepted and will be processed in a few seconds.`;
        break;
    }

    store.dispatch(successAlertDialogDisplayed({ text }));
  }
};

export default addedTransactionMiddleware;
