terraform {
  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2.0"
    }
  }
}

provider "null" {}

resource "null_resource" "minikube_setup" {
  provisioner "local-exec" {
    command = "minikube start --driver=docker --memory=4096 --cpus=4"
  }
}

resource "null_resource" "kubectl_apply" {
  depends_on = [null_resource.minikube_setup]

  provisioner "local-exec" {
    interpreter = ["PowerShell", "-Command"]
    command = "Start-Sleep -Seconds 15; kubectl config use-context minikube; kubectl apply -f ../k8s/"
  }
}

output "minikube_ip" {
  value       = "Run 'minikube ip' to get the cluster IP."
  description = "The IP address of the local Minikube cluster."
}
