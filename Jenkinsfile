pipeline {
    agent {
        docker {
            image 'node:20.2.0-alpine3.17'
        }
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm install react@18 react-dom@18'
            }
        }

        stage('Build') {
            steps {
                sh 'CI=false npm run build'
            }
        }
    }
}
