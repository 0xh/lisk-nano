
import 'angular-material-data-table/dist/md-data-table.js'
import 'angular-material-data-table/dist/md-data-table.css'

import './index.less'

import './app'

import './theme/theme'
import './util/animateOnChange/animateOnChange'
import './components/main/main'
import './components/login/login'
import './components/account/account'
import './components/send/send'
import './components/transactions/transactions'
import './components/lsk/lsk'
import './filters/epochStamp'
import './filters/timestamp'
import './services/peer'
import './services/peers'
import './services/error'
import './services/success'

import angular from 'angular'

angular.element(document).ready(() => {
  angular.bootstrap(document, ['app'])
})
