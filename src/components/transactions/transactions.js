
import './transactions.less'

import app from '../../app'

const UPDATE_INTERVAL = 10000

app.component('transactions', {
  template: require('./transactions.jade')(),
  bindings: {
    account: '=',
    peer: '=',
  },
  controller: class main {
    constructor ($scope, $timeout, $q) {
      this.$scope = $scope
      this.$timeout = $timeout
      this.$q = $q

      this.transactions = []

      this.updateTransactions()
    }

    $onDestroy () {
      this.$timeout.cancel(this.timeout)
    }

    updateTransactions (more) {
      if (more) {
        this.loading_more = true
      }

      this.$timeout.cancel(this.timeout)

      return this.peer.getTransactions(this.account.address, (this.transactions.length || 10) + (more ? 10 : 0))
        .then(res => {
          this.transactions = res.transactions
          this.total = res.count

          if (this.total > this.transactions.length) {
            this.more = this.total - this.transactions.length
          } else {
            this.more = 0
          }

          if (more) {
            this.loading_more = false
          }

          this.timeout = this.$timeout(this.updateTransactions.bind(this), UPDATE_INTERVAL)
        })
        .catch(() => {
          return this.$q.reject()
        })
    }
  }
})
