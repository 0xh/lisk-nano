def fail(reason) {
    slackSend color: 'danger', message: "Build #${env.BUILD_NUMBER} of <${env.BUILD_URL}|${env.JOB_NAME}> (${env.BRANCH_NAME}) failed (<${env.BUILD_URL}/console|console>, <${env.BUILD_URL}/changes|changes>)", channel: '#lisk-nano-jenkins'
    currentBuild.result = 'FAILURE'
    milestone 1
    error(${reason})
}

node('lisk-nano-01'){
  lock(resource: "lisk-nano-01", inversePrecedence: true) {
    stage ('Cleanup Orphaned Processes') {
      try {
      sh '''
        # Clean up old processes
        cd ~/lisk-test-nano
        bash lisk.sh stop_node
        pkill -f selenium -9 || true
        pkill -f Xvfb -9 || true
        rm -rf /tmp/.X0-lock || true
        pkill -f webpack -9 || true
      '''
      } catch (err) {
        fail('Stopping build, installation failed')
      }
    }

    stage ('Prepare Workspace') {
      try {
        deleteDir()
        checkout scm
      } catch (err) {
        fail('Stopping build, Checkout failed')
      }
    }

    stage ('Start Lisk Core') {
      try {
        sh '''#!/bin/bash
          cd ~/lisk-test-nano
          bash lisk.sh rebuild -f /home/lisk/lisk-test-nano/blockchain_explorer.db.gz
          '''
      } catch (err) {
        fail('Stopping build, Lisk Core failed to start')
      }
    }

    stage ('Install npm dependencies') {
      try {
        sh '''#!/bin/bash
        npm install
        # Build nano
        cd $WORKSPACE
        npm install

        '''
      } catch (err) {
        fail('Stopping build, npm install failed')
      }
    }

    stage ('Run Eslint') {
      try {
        ansiColor('xterm') {
          sh '''
          cd $WORKSPACE
          npm run eslint
          '''
	}
      } catch (err) {
        fail('Stopping build, Eslint failed')
      }
    }

    stage ('Build Nano') {
      try {
        sh '''#!/bin/bash
        # Add coveralls config file
        cp ~/.coveralls.yml-nano .coveralls.yml

        # Run Build
        npm run build
        '''
      } catch (err) {
        fail('Stopping build, Nano build failed')
      }
    }

    stage ('Run Tests') {
      try {
        ansiColor('xterm') {
          sh '''
          export ON_JENKINS=true

          # Run test
          cd $WORKSPACE
          npm run test

          # Submit coverage to coveralls
          cat coverage/*/lcov.info | coveralls -v
          '''
      }
      } catch (err) {
        fail('Stopping build, Test suite failed')
      }
    }

    stage ('Start Dev Server and Run Tests') {
      try {
        ansiColor('xterm') {
          sh '''
          # Run Dev build and Build
          cd $WORKSPACE
          export NODE_ENV=
          npm run dev &> .lisk-nano.log &
          sleep 30

          # End to End test configuration
          export DISPLAY=:99
          Xvfb :99 -ac -screen 0 1280x1024x24 &
          ./node_modules/protractor/bin/webdriver-manager update

          # Run End to End Tests
          npm run e2e-test

          cd ~/lisk-test-nano
          bash lisk.sh stop_node
          pkill -f selenium -9 || true
          pkill -f Xvfb -9 || true
          rm -rf /tmp/.X0-lock || true
          pkill -f webpack -9 || true
          '''
        }
      } catch (err) {
        fail('Stopping build, End to End Test suite failed')
      }
    }

    stage ('Deploy') {
      try {
        sh '''
        rsync -axl --delete "$WORKSPACE/app/dist/" "jenkins@master-01:/var/www/test/lisk-nano/$BRANCH_NAME/"

        # Cleanup - delete all files on success
        rm -rf "$WORKSPACE/*"
        '''
      } catch (err) {
        fail('Stopping build, End to End Test suite failed')
      }
    }

    stage ('Set milestone') {
      milestone 1
    }
  }
}
