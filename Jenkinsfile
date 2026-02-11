pipeline {
    agent {
        docker {            
            image 'node:20.2.0-alpine3.17'
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('install docker'){
            steps {
                sh '''
                apk add --no-cache docker
                '''
            }
        }
        stage('Build') {
            steps {
                script {
                    // Aqui você garante que está no contexto adequado (com acesso ao workspace)
                    node {
                        sh 'npm install  react@18 react-dom@18'
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
                    sh "docker build -t keycontrolfront ."
                    sh "docker tag keycontrolfront jv1nicius/keycontrolfront:latest"
                    sh "docker push jv1nicius/keycontrolfront:latest"
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
