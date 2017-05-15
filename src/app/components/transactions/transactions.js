import './transactions.less';

app.component('transactions', {
  template: require('./transactions.pug')(),
  controller: class transactions {
    constructor($scope, $rootScope, $q, Peers, Account, AccountApi) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$q = $q;
      this.peers = Peers;
      this.account = Account;
      this.accountApi = AccountApi;

      this.loaded = false;
      this.transactions = [];
      this.pendingTransactions = [];

      // Update transactions list if one was created
      this.$scope.$on('transactionCreation', (event, transaction) => {
        this.pendingTransactions.unshift(transaction);
        this.transactions.unshift(transaction);
      });

      this.init.call(this);
      this.$scope.$on('accountChange', () => {
        this.init.call(this);
      });
    }

    init(showLoading) {
      if (this.account.get().address) {
        this.reset();
        this.update(showLoading);
      }
    }

    reset() {
      this.loaded = false;
    }

    showMore() {
      if (this.moreTransactionsExist) {
        this.update(true, true);
      }
    }

    update(showLoading, showMore) {
      if (showLoading) {
        this.loaded = false;
      }

      const limit = Math.max(10, this.transactions.length + (showMore ? 10 : 0));
      return this.loadTransactions(limit);
    }

    loadTransactions(limit) {
      return this.accountApi.transactions.get(this.account.get().address, limit)
        .then(this._processTransactionsResponse.bind(this))
        .catch(() => {
          this.transactions = [];
          this.moreTransactionsExist = 0;
        })
        .finally(() => {
          this.loaded = true;
        });
    }

    _processTransactionsResponse(response) {
      this.pendingTransactions = this.pendingTransactions.filter(
        pt => response.transactions.filter(t => t.id === pt.id).length === 0);
      this.transactions = this.pendingTransactions.concat(response.transactions);
      this.total = response.count;

      this.moreTransactionsExist = Math.max(0, this.total - this.transactions.length);
    }
  },
});
