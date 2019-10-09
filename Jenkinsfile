pipeline {
  environment {
    registry = "registry.cn-hongkong.aliyuncs.com/XXXv3/apfrontend"
    registryCredential = "XXX-bitmantech-aliyun"
    BUILD_NUMBER = "test"
  }

  agent any

  stages {
    stage('Building image') {
      steps{
        script {
          //docker.build registry + ":$BUILD_NUMBER" -f ./provisioning/Dockerfile
          //def appImage = docker.build(registry + ":$BUILD_NUMBER", "-f ./provisioning/Dockerfile .")
          //appImage.push()
          docker.withRegistry(registry, 'XXX-bitmantech-aliyun') {
            def customImage = docker.build(registry + ":$BUILD_NUMBER")
            customImage.push()
          }
        }
      }
    }
  }
}
