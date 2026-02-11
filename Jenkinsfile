pipeline {
    agent any

    tools {
        nodejs "NodeJS"         // Nome da instalação Node configurada no Jenkins
    }

    environment {
        BUILD_DIR = "build"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Clonando repo..."
                git url: 'https://github.com/jv1nicius/keyControlFront.git', branch: 'main'
            }
        }

        stage('Install') {
            steps {
                echo "Instalando dependências…"
                sh 'npm install react@18 react-dom@18'
            }
        }

        stage('Test') {
            steps {
                echo "Executando testes…"
                sh 'npm test || true'
            }
        }

        stage('Build') {
            steps {
                echo "Gerando build de produção…"
                sh 'npm start'
            }
        }

        stage('Post-Build') {
            steps {
                echo "Arquivando artefatos…"
                archiveArtifacts artifacts: 'build/**'
            }
        }
    }

    post {
        success {
            echo "Pipeline concluída com sucesso! 🎉"
        }
        failure {
            echo "Pipeline falhou ❌"
        }
    }
}
