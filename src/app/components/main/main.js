import lisk from 'lisk-js';

import './main.less';

const UPDATE_INTERVAL_BALANCE = 10000;

app.component('main', {
  template: require('./main.pug')(),
  controller: class main {
    constructor($scope, $rootScope, $timeout, $q, $peers, error, SendModal, signVerify) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$timeout = $timeout;
      this.$q = $q;
      this.$peers = $peers;
      this.error = error;
      this.signVerify = signVerify;
      this.sendModal = SendModal;

      this.$scope.$on('login', this.login.bind(this));
    }

    reset() {
      this.$timeout.cancel(this.timeout);
    }

    login(attempts = 0) {
      this.prelogged = true;

      this.$peers.setActive();

      const kp = lisk.crypto.getKeys(this.passphrase);
      this.address = lisk.crypto.getAddress(kp.publicKey);

      this.update()
        .then(() => {
          this.prelogged = false;
          this.logged = true;
          this.checkIfIsDelegate();
        })
        .catch(() => {
          if (attempts < 10) {
            this.$timeout(() => this.login(attempts + 1), 1000);
          } else {
            this.error.dialog({ text: 'No peer connection' });
            this.logout();
          }
        });
    }

    logout() {
      this.reset();
      this.$peers.reset(true);

      this.logged = false;
      this.prelogged = false;
      this.account = {};
      this.passphrase = '';
    }

    checkIfIsDelegate() {
      if (this.account && this.account.publicKey) {
        this.$peers.active.sendRequest('delegates/get', {
          publicKey: this.account.publicKey,
        }, (data) => {
          this.isDelegate = data.success;
        });
      }
    }

    update() {
      this.reset();
      return this.$peers.active.getAccountPromise(this.address)
        .then((res) => {
          this.account = res;
          this.sendModal.init(this.account, this.passphrase);
        })
        .catch((res) => {
          this.account.balance = undefined;
          return this.$q.reject(res);
        })
        .finally(() => {
          this.timeout = this.$timeout(this.update.bind(this), UPDATE_INTERVAL_BALANCE);
          return this.$q.resolve();
        });
    }
  },
});
