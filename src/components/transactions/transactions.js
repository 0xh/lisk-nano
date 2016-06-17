
import './transactions.less'

import moment from 'moment'

import app from '../../app'

const UPDATE_INTERVAL = 5000

app.directive('transactions', ($timeout, $q) => {
  return {
    restrict: 'E',
    template: require('./transactions.jade'),
    link (scope, elem, attrs) {},
    controller: ($scope, timestampFilter) => {
      $scope.updateTransactions = () => {
        $timeout.cancel($scope.timeouts.transactions)

        return $scope.peer.getTransactions($scope.address)
          .then(res => {
            let data = {}

            for (let transaction of res) {
              let group = moment(timestampFilter(transaction.timestamp)).format('LL')

              if (!data[group]) {
                data[group] = []
              }

              data[group].push(transaction)
            }

            $scope.transactions = data
            $scope.timeouts.transactions = $timeout($scope.updateTransactions, UPDATE_INTERVAL)
          })
          .catch(() => {
            $scope.$emit('error')
            return $q.reject()
          })
      }

      $scope.updateTransactions()
    }
  }
})
