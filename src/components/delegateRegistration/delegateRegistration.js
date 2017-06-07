import './delegateRegistration.less';

/**
 * @description The directive performing as the form to register the account as delegate
 *
 * @class app.delegateRegistration
 * @memberOf app
 */
app.component('delegateRegistration', {
  template: require('./delegateRegistration.pug')(),
  controller: function ($scope, $mdDialog, delegateApi, Account, dialog, $rootScope) {
    function checkPendingRegistration() {
      delegateApi.getDelegate({
        username: $scope.username,
      }).then((data) => {
        Account.set({
          isDelegate: true,
          username: data.delegate.username,
        });
        $scope.pendingRegistrationListener();
      });
    }

    $scope.form = {
      name: '',
      fee: 25,
      error: '',
      onSubmit: (form) => {
        if (form.$valid) {
          $scope.username = $scope.form.name.toLowerCase();
          delegateApi.registerDelegate(
              $scope.username,
              Account.get().passphrase,
              $scope.form.secondPassphrase,
            )
            .then(() => {
              dialog.successAlert({
                text: 'Delegate registration was successfully submitted. It can take several seconds before it is processed.',
              })
                .then(() => {
                  $scope.pendingRegistrationListener = $rootScope.$on('syncTick', () => {
                    checkPendingRegistration();
                  });
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

    /**
     * Resets the from fields and form state.
     *
     * @method reset
     * @param {Object} from - The form event object. containing form elements and errors list.
     */
    $scope.reset = (form) => {
      $scope.form.name = '';
      $scope.form.error = '';

      form.$setPristine();
      form.$setUntouched();
    };

    /**
     * hides the dialog and resets form.
     *
     * @method cancel
     * @param {Object} from - The form event object. containing form elements and errors list.
     */
    $scope.cancel = (form) => {
      $scope.reset(form);
      $mdDialog.hide();
    };
  },
});
