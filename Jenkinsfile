// Development Jenkinsfile
pipeline {
  agent any

  options {
    buildDiscarder(logRotator(artifactDaysToKeepStr: '30', artifactNumToKeepStr: '15', daysToKeepStr: '150', numToKeepStr: '15'))
    disableConcurrentBuilds()
    ansiColor('xterm')
    timeout(time: 15, unit: 'MINUTES')
  }

  environment {
    NPM_CONFIG_PREFIX=".npm"
    NPM_CONFIG_CACHE="npm_cache"
  }

  stages {
    stage('checkout') {
      steps {
        checkout scm
      }
    }

    stage('install') {
      agent {
        docker {
          image 'node:10.16.3'
          reuseNode true
        }
      }
      steps {
        sh """
            cd examples/base-implementation
            rm -rf allure
            npm ci
        """
      }
    }

    stage('test:e2e') {
      agent {
        docker {
          image 'circleci/node:10.16.3-browsers'
          reuseNode true
        }
      }
      stages {
          stage('test:e2e:run:chrome') {
          environment {
            // https://github.com/DevExpress/testcafe/issues/1133#issuecomment-350775990
            // Chrome needs the --no-sandbox flag to run the tests in a docker container 
            TESTCAFE_BROWSER = "chrome:headless --no-sandbox"
          }
          steps {
            sh """
                cd examples/base-implementation
                npm run test:e2e:api
            """
          }
        }
      }
    }

    stage('test:reports') {
      steps {
        script {
          allure([
            commandline: 'allure-2.x',
            includeProperties: false,
            jdk: '',
            results: [[path: 'examples/base-implementation/allure/allure-results']]
          ])
        }
      }
    }
  }

  post {
    changed {
      emailext(
        subject: "${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
        body: '${JELLY_SCRIPT, template="html"}',
        recipientProviders: [developers(), culprits(), requestor()]
      )
    }
  }
}
