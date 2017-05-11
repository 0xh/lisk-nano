app.run(($rootScope, $timeout, $state, $transitions, $mdDialog, Peers, Account, Sync) => {
  $rootScope.peers = Peers;
  Sync.init();

  $transitions.onStart({ to: '*' }, () => {
    $mdDialog.cancel();
  });

  $rootScope.reset = () => {
    $timeout.cancel($rootScope.timeout);
  };

  $rootScope.logout = () => {
    $rootScope.reset();
    Peers.reset(true);

    $rootScope.logged = false;
    $rootScope.prelogged = false;
    Account.reset();

    $state.go('login');
  };
});
