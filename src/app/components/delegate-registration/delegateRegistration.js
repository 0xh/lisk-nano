import './delegateRegistration.less';

app.directive('delegateRegistration', ($mdDialog, delegateService, Account, dialog, $timeout) => {
  const DelegateRegistrationLink = function ($scope, $element) {
    function checkPendingRegistration() {
      delegateService.getDelegate({
        username: $scope.username,
      }).then((data) => {
        Account.set({
          isDelegate: true,
          username: data.delegate.username,
        });
      }).catch(() => {
        $timeout(checkPendingRegistration, 10000);
      });
    }

    $scope.form = {
      name: '',
      fee: 25,
      error: '',
      onSubmit: (form) => {
        if (form.$valid) {
          $scope.username = $scope.form.name.toLowerCase();
          delegateService.registerDelegate(
              $scope.username,
              Account.get().passphrase,
              $scope.form.secondPassphrase,
            )
            .then(() => {
              dialog.successAlert({
                title: 'Success',
                text: 'Delegate registration was successfully submitted. It can take several seconds before it is confirmed.',
              })
                .then(() => {
                  checkPendingRegistration();
                  $scope.reset(form);
                  $mdDialog.hide();
                });
            })
            .catch((error) => {
              $scope.form.error = error.message ? error.message : '';
            });
        }
      },
    };

    $scope.reset = (form) => {
      $scope.form.name = '';
      $scope.form.error = '';

      form.$setPristine();
      form.$setUntouched();
    };

    $scope.cancel = (form) => {
      $scope.reset(form);
      $mdDialog.hide();
    };

    $element.bind('click', () => {
      $mdDialog.show({
        template: require('./delegateRegistration.pug')(),
        bindToController: true,
        locals: {
          form: $scope.form,
          cancel: $scope.cancel,
          account: Account,
        },
        controller: () => {},
        controllerAs: '$ctrl',
      });
    });
  };

  return {
    restrict: 'A',
    link: DelegateRegistrationLink,
  };
});
