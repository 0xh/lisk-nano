const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');

const expect = chai.expect;

chai.use(sinonChai);

describe('main component controller', () => {
  beforeEach(angular.mock.module('app'));

  let $rootScope;
  let $scope;
  let $q;
  let $componentController;
  let controller;

  beforeEach(inject((_$componentController_, _$rootScope_, _$q_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();
    controller = $componentController('main', $scope, {
      passphrase: '',
    });
  });

  describe('controller()', () => {
    it.skip('sets $watch on $ctrl.$peers.active to broadcast it changed', () => {
      // Skipped as it doesn't work
      $scope.$apply();
      const mock = sinon.mock(controller.$rootScope);
      mock.expects('$broadcast').withArgs('peerUpdate').returns();
      controller.$peers.active = { name: 'CHANGED' };
      $scope.$apply();
      controller.$peers.active.name = 'CHANGED AGAIN';
      $scope.$apply();
      mock.verify();
      mock.restore();
    });
  });

  describe('reset()', () => {
    it('cancels $timeout', () => {
      const spy = sinon.spy(controller.$timeout, 'cancel');
      controller.reset();
      expect(spy).to.have.been.calledWith(controller.timeout);
    });
  });

  describe('login()', () => {
    let deffered;
    let updateMock;
    let peersMock;

    beforeEach(() => {
      deffered = $q.defer();
      updateMock = sinon.mock(controller);
      updateMock.expects('update').withArgs().returns(deffered.promise);

      peersMock = sinon.mock(controller.$peers);
      peersMock.expects('setActive').withArgs();
    });

    afterEach(() => {
      updateMock.verify();
      updateMock.restore();
    });

    it('sets active peer', () => {
      controller.login();

      deffered.resolve();
      $scope.$apply();
    });

    it('calls this.update() and then sets this.logged = true', () => {
      controller.login();
      deffered.resolve();
      $scope.$apply();

      expect(controller.logged).to.equal(true);
    });

    it('calls this.update() and if that fails and attempts < 10, then sets a timeout to try again', () => {
      const spy = sinon.spy(controller, '$timeout');

      controller.login();
      deffered.reject();
      $scope.$apply();

      expect(spy).to.have.been.calledWith();
    });

    it('calls this.update() and if that fails and attempts >= 10, then show error dialog', () => {
      const spy = sinon.spy(controller.error, 'dialog');

      controller.login(10);
      deffered.reject();
      $scope.$apply();

      expect(spy).to.have.been.calledWith({ text: 'No peer connection' });
    });
  });

  describe('logout()', () => {
    it('resets main component', () => {
      const spy = sinon.spy(controller, 'reset');
      controller.logout();
      expect(spy).to.have.been.calledWith();
    });

    it('resets peers', () => {
      const spy = sinon.spy(controller.$peers, 'reset');
      controller.logout();
      expect(spy).to.have.been.calledWith(true);
    });

    it('sets this.logged = false', () => {
      controller.logout();
      expect(controller.logged).to.equal(false);
    });

    it('sets this.prelogged = false', () => {
      controller.logout();
      expect(controller.prelogged).to.equal(false);
    });

    it('sets this.account = {}', () => {
      controller.logout();
      expect(controller.account).to.deep.equal({});
    });

    it('sets this.passphrase = \'\'', () => {
      controller.logout();
      expect(controller.passphrase).to.equal('');
    });
  });

  describe('update()', () => {
    let deffered;
    let account;

    beforeEach(() => {
      deffered = $q.defer();
      account = {
        address: '16313739661670634666L',
        balance: '0',
      };
      controller.$peers.active = {
        getAccountPromise() {
          return deffered.promise;
        },
        getStatusPromise() {
          return $q.defer().promise;
        },
      };
      controller.address = account.address;
      controller.account = {};
    });

    it('calls this.$peers.active.getAccountPromise(this.address) and then sets result to this.account', () => {
      expect(controller.account).not.to.equal(account);
      controller.update();
      deffered.resolve(account);
      $scope.$apply();
      expect(controller.account).to.equal(account);
    });

    it('calls this.$peers.active.getAccountPromise(this.address) and if it fails, then resets this.account.balance and reject the promise that update() returns', () => {
      const spy = sinon.spy(controller.$q, 'reject');
      controller.update();
      deffered.reject();
      $scope.$apply();
      expect(controller.account.balance).to.equal(undefined);
      controller.reset();
      expect(spy).to.have.been.calledWith();
    });
  });
});
