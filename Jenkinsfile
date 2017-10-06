def fail(reason) {
  currentBuild.result = 'FAILURE'
  error("${reason}")
}

node('lisk-nano-01') {
  try {
    stage ('Cleanup, Checkout and Start Lisk Core') {
      try {
        deleteDir()
        checkout scm
      } catch (err) {
        fail('Stopping build: checkout failed')
      }

      try {
        sh '''
          N=${EXECUTOR_NUMBER:-0}
          cp -r ~/lisk-Linux-x86_64 ~/lisk-Linux-x86_64_$N
          cd ~/lisk-Linux-x86_64_$N
          # change core port
          sed -i -r -e "s/^(.*ort\\":) 4000,/\\1 400$N,/" config.json
          # disable redis
          sed -i -r -e "s/^(\\s*\\"cacheEnabled\\":) true/\\1 false/" config.json
          # change postgres databse
          sed -i -r -e "s/^(\\s*\\"database\\": \\"lisk_test)\\",/\\1_$N\\",/" config.json
          JENKINS_NODE_COOKIE=dontKillMe bash lisk.sh start_db
          bash lisk.sh rebuild -f blockchain_explorer.db.gz
          '''
      } catch (err) {
        fail('Stopping build: Lisk Core failed to start')
      }
    }

    stage ('Install npm dependencies') {
      try {
        sh 'npm install'
      } catch (err) {
        fail('Stopping build: npm install failed')
      }
    }

    stage ('Run Eslint') {
      try {
        ansiColor('xterm') {
	  sh 'npm run eslint'
        }
      } catch (err) {
        fail('Stopping build: Eslint failed')
      }
    }

    stage ('Build Nano') {
      try {
        sh '''
        cp ~/.coveralls.yml-nano .coveralls.yml
        npm run build
        '''
      } catch (err) {
        fail('Stopping build: nano build failed')
      }
    }

    stage ('Run Unit Tests') {
      try {
        ansiColor('xterm') {
	  sh '''
	  ON_JENKINS=true npm run test
	  # Submit coverage to coveralls
	  cat coverage/*/lcov.info | coveralls -v
	  '''
        }
      } catch (err) {
        fail('Stopping build: test suite failed')
      }
    }

    stage ('Start Dev Server and Run E2E Tests') {
      try {
        ansiColor('xterm') {
          sh '''
          N=${EXECUTOR_NUMBER:-0}
          NODE_ENV= npm run dev -- --port 808$N &> .lisk-nano.log &
          sleep 30

          # End to End test configuration
          export DISPLAY=:1$N
          Xvfb :1$N -ac -screen 0 1280x1024x24 &
          ./node_modules/protractor/bin/webdriver-manager update

          # Run end-to-end tests
          npm run e2e-test -- --params.baseURL http://localhost:808$N/ --params.liskCoreURL http://localhost:400$N
          '''
        }
      } catch (err) {
        fail('Stopping build: end-to-end test suite failed')
      }
    }

    stage ('Deploy and Set Milestone') {
      milestone 1
      try {
        sh 'rsync -axl --delete --rsync-path="mkdir -p '/var/www/test/lisk-nano/$BRANCH_NAME/' && rsync" "$WORKSPACE/app/dist/" "jenkins@master-01:/var/www/test/lisk-nano/$BRANCH_NAME/"'
      } catch (err) {
        fail('Stopping build: deploy failed')
      }
    }
  } catch(err) {
    fail('Stopping build: unexpected failure')
  } finally {
    sh '''
    N=${EXECUTOR_NUMBER:-0}
    ( cd ~/lisk-Linux-x86_64_$N && bash lisk.sh stop_node ) || true
    pkill -f "Xvfb :1$N" -9 || true
    pkill -f "webpack.*808$N" -9 || true
    rm -rf ~/lisk-Linux-x86_64_$N
    rm -rf $WORKSPACE/node_modules/
    '''

    def pr_branch = ''
    if (env.CHANGE_BRANCH != null) {
      pr_branch = " (${env.CHANGE_BRANCH})"
    }
    if (currentBuild.result == 'SUCCESS') {
      /* delete all files on success */
      sh 'rm -rf $WORKSPACE/*'
      /* notify of success if previous build failed */
      if (previous_build != null && previous_build.result == 'FAILURE') {
        slackSend color: 'good',
                  message: "Recovery: build #${env.BUILD_NUMBER} of <${env.BUILD_URL}|${env.JOB_NAME}>${pr_branch} was successful.",
                  channel: '#lisk-nano-jenkins'
      }
    } else if (currentBuild.result == 'FAILURE') {
      slackSend color: 'danger',
                message: "Build #${env.BUILD_NUMBER} of <${env.BUILD_URL}|${env.JOB_NAME}>${pr_branch} failed (<${env.BUILD_URL}/console|console>, <${env.BUILD_URL}/changes|changes>)",
                channel: '#lisk-nano-jenkins'
    }
  }
}
