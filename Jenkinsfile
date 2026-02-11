pipeline {
    agent {
        docker {
            image 'node:20-alpine'
            args '-v /var/run/docker.sock:/var/run/docker.sock'  // Permite que o Docker dentro do container funcione
        }
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // Defina as credenciais no Jenkins
        IMAGE_NAME = 'jv1nicius/keycontrolfront'
        TAG = "latest"  // Aqui você pode colocar uma versão ou usar 'latest'
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'CI=false npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Construir a imagem Docker
                    sh "docker build -t ${IMAGE_NAME}:${TAG} ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Login no Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    }
                    
                    // Fazer o push da imagem para o Docker Hub
                    sh "docker push ${IMAGE_NAME}:${TAG}"
                }
            }
        }
    }

    post {
        always {
            // Limpeza, se necessário
            cleanWs()
        }
    }
}
