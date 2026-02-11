pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                script {
                    // Aqui você garante que está no contexto adequado (com acesso ao workspace)
                    node {
                        sh 'npm install'
                        sh 'CI=false npm run build'
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Aqui o login no Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    }

                    // Construir e fazer push da imagem Docker
                    sh "docker build -t your-dockerhub-username/your-image-name:latest ."
                    sh "docker push your-dockerhub-username/your-image-name:latest"
                }
            }
        }

        stage('Clean Workspace') {
            steps {
                cleanWs()  // Limpeza do workspace ao final
            }
        }
    }
}
