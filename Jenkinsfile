pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "jv1nicius/keycontrolfront"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/jv1nicius/keycontrolfront.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${BUILD_NUMBER}")
                }
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        docker.image("${DOCKER_IMAGE}:${BUILD_NUMBER}").push()
                        docker.image("${DOCKER_IMAGE}:${BUILD_NUMBER}").push("latest")
                    }
                }
            }
        }

    }
    post {
        success {
            echo "Imagem enviada com sucesso 🚀"
        }
        failure {
            echo "Erro na pipeline ❌"
        }
    }
}
