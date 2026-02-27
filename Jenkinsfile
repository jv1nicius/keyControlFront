pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "jv1nicius/keycontrolfront"
        VERSION = "latest"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/jv1nicius/keycontrolfront.git'
            }
        }

        stage('Build Image') {
            steps {
                sh "docker build -t $DOCKER_IMAGE:$VERSION ."
            }
        }

        stage('Login DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                sh "docker push $DOCKER_IMAGE:$VERSION"
            }
        }

    }

    post {
        success {
            echo "Imagem enviada e deploy realizado com sucesso 🚀"
        }
        failure {
            echo "Erro na pipeline ❌"
        }
    }
}