const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('setSecondPass Directive', () => {
  let $compile;
  let $scope;
  let $rootScope;
  let element;
  let $peers;
  let setSecondPass;
  let $q;
  let success;

  beforeEach(() => {
    // Load the myApp module, which contains the directive
    angular.mock.module('app');

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    inject((_$compile_, _$rootScope_, _setSecondPass_, _$peers_, _$q_, _success_) => {
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      setSecondPass = _setSecondPass_;
      $peers = _$peers_;
      $q = _$q_;
      success = _success_;
      $scope = $rootScope.$new();
    });

    // Compile a piece of HTML containing the directive
    element = $compile('<button data-set-second-pass></button>')($scope);
    $scope.$digest();
  });

  describe('SetSecondPassLink', () => {
    it('Listens for broadcasting onAfterSignup', () => {
      $peers.active = { setSignature() {} };
      const mock = sinon.mock($peers.active);
      const deffered = $q.defer();
      mock.expects('setSignature').returns(deffered.promise);

      const spy = sinon.spy(success, 'dialog');

      $scope.$broadcast('onAfterSignup', {
        passphrase: 'TEST_VALUE',
        target: 'second-pass',
      });

      deffered.resolve({});
      $scope.$apply();

      expect(spy).to.have.been.calledWith();
    });

    it('binds click listener to call setSecondPass.show()', () => {
      const spy = sinon.spy(setSecondPass, 'show');
      element.triggerHandler('click');
      $scope.$digest();

      expect(spy).to.have.been.calledWith();
    });
  });

  describe('scope.passConfirmSubmit', () => {
    it('should call $peers.active.setSignature', () => {
      $peers.active = { setSignature() {} };
      const mock = sinon.mock($peers.active);
      const deffered = $q.defer();
      mock.expects('setSignature').returns(deffered.promise);

      const spy = sinon.spy(success, 'dialog');
      $scope.passConfirmSubmit();

      deffered.resolve({});
      $scope.$apply();

      expect(spy).to.have.been.calledWith();
    });
  });
});
