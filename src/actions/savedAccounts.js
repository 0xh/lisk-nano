import actionTypes from '../constants/actions';
import { getSavedAccounts, setSavedAccount, removeSavedAccount, setLastActiveAccount } from '../utils/savedAccounts';

/**
 * An action to dispatch accountSaved
 *
 */
export const accountSaved = (data) => {
  setSavedAccount(data);
  setLastActiveAccount(data);
  return {
    data,
    type: actionTypes.accountSaved,
  };
};

/**
 * An action to dispatch accountRemoved
 */
export const accountRemoved = (account) => {
  removeSavedAccount(account);
  return {
    data: account,
    type: actionTypes.accountRemoved,
  };
};

/**
 * An action to dispatch accountSwitched
 */
export const accountSwitched = (account) => {
  setLastActiveAccount(account);
  return {
    data: account,
    type: actionTypes.accountSwitched,
  };
};

/**
 * The action to initiate savedAccounts store with the retrieved accounts
 *
 * @todo since the utility returns only one item, this action puts it in the array
 * eventually it should receive an array and return that to reducer
 *
 */
export const accountsRetrieved = () => {
  const accounts = getSavedAccounts();
  const data = accounts !== undefined ? accounts : [];
  return {
    data,
    type: actionTypes.accountsRetrieved,
  };
};
