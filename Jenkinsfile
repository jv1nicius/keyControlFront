pipeline {

    agent any

    environment {
        IMAGE_NAME = "jv1nicius/keycontrolfront"
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'mui-version',
                    url: 'https://github.com/jv1nicius/keyControlFront.git'
            }
        }


        stage('Docker Build') {
            steps {
                sh '''
                docker build \
                -t $IMAGE_NAME:latest .
                '''
            }
        }


        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {

                    sh '''
                    echo $DOCKER_PASS | docker login \
                    -u $DOCKER_USER \
                    --password-stdin
                    '''

                }
            }
        }


        stage('Docker Push') {
            steps {
                sh '''
                docker push $IMAGE_NAME:latest
                '''
            }
        }
    }
}
