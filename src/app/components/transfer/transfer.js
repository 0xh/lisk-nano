import './transfer.less';

/**
 * This component is a form for transfering funds to other accounts.
 *
 * @module app
 * @submodule transfer
 */
app.component('transfer', {
  template: require('./transfer.pug')(),
  bindings: {
    recipientId: '<',
    transferAmount: '<',
  },
  /**
   * The transfer component constructor class
   *
   * @class transfer
   * @constructor
   */
  controller: class transfer {
    constructor($scope, lsk, dialog, $mdDialog, $q, $rootScope, Account, AccountApi) {
      this.$scope = $scope;
      this.dialog = dialog;
      this.$mdDialog = $mdDialog;
      this.$q = $q;
      this.$rootScope = $rootScope;
      this.account = Account;
      this.accountApi = AccountApi;

      this.recipient = {
        regexp: '^[0-9]{1,21}[L|l]$',
        value: $scope.$ctrl.recipientId,
      };

      this.amount = {
        regexp: '^[0-9]+(.[0-9]{1,8})?$',
      };

      /**
       * @todo Check if it's possible to replace these watchers with filters.
       */
      if ($scope.$ctrl.transferAmount) {
        this.amount.value = parseInt(lsk.normalize($scope.$ctrl.transferAmount), 10);
      }

      this.$scope.$watch('$ctrl.amount.value', () => {
        if (lsk.from(this.amount.value) !== this.amount.raw) {
          this.amount.raw = lsk.from(this.amount.value) || 0;
        }
      });

      this.$scope.$watch('$ctrl.account.balance', () => {
        this.amount.max = lsk.normalize(this.account.get().balance - 10000000);
      });

      this.$scope.$watch('$ctrl.amount.value', () => {
        if (this.amount.value) {
          this.transferForm.amount.$setValidity('max', parseFloat(this.amount.value) <= parseFloat(this.amount.max));
        }
      });
    }

    /**
     * Resets the values of receipentId and amount
     *
     * @method reset
     */
    reset() {
      this.recipient.value = '';
      this.amount.value = '';
    }

    /**
     * Should be called on form submittion.
     * Calls transaction.create to transfer the specified amount to recipient.
     *
     * @method transfer
     */
    transfer() {
      this.loading = true;

      this.accountApi.transactions.create(
        this.recipient.value,
        this.amount.raw,
        this.account.get().passphrase,
        this.secondPassphrase || null,
      ).then((data) => {
        const transaction = {
          id: data.transactionId,
          senderPublicKey: this.account.get().publicKey,
          senderId: this.account.get().address,
          recipientId: this.recipient.value,
          amount: this.amount.raw,
          fee: 10000000,
        };
        this.$rootScope.$broadcast('transactionCreation', transaction);
        return this.dialog.successAlert({ text: `${this.amount.value} LSK was successfully transferred to ${this.recipient.value}` })
            .then(() => {
              this.reset();
            });
      }).catch((res) => {
        this.dialog.errorAlert({ text: res && res.message ? res.message : 'An error occurred while creating the transaction.' });
      }).finally(() => {
        this.loading = false;
      });
    }

    /**
     * Sets all the funds of the account to the amount value to be transfered.
     *
     * @method setMaxAmount
     */
    setMaxAmount() {
      this.amount.value = Math.max(0, this.amount.max);
    }

    /**
     * Cancels the dialog.
     *
     * @method cancel
     * @todo Should reset the form too.
     */
    cancel() {
      this.$mdDialog.cancel();
    }
  },
});
