# Patient Appointment Microservices System

This repository contains the complete full-stack, DevOps-driven microservices architecture for a Patient Appointment and Queue Management System.

## Pre-requisites (Local Deployment)
- Linux / WSL Environment
- Docker Desktop or Docker Engine installed
- Terraform installed
- Ansible installed (optional for local env setup)

## 1. Local Testing with Docker Compose
To run the entire system locally without Kubernetes:
```bash
docker-compose up --build
```
- **Frontend App**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **User Service DB**: localhost:27017
- *(and so on...)*

## 2. Infrastructure Setup (Automated)
If you do not have Docker or Minikube installed, use Ansible:
```bash
cd ansible
ansible-playbook -i inventory.ini playbook.yml
```

## 3. Kubernetes Local Deployment (Minikube + Terraform)
To start your local Kubernetes environment and deploy the manifests using Terraform:
```bash
cd terraform
terraform init
terraform apply -auto-approve
```
*Note: This utilizes `local-exec` to run Minikube commands and `kubectl apply` for you under the hood.*

## 4. Kubernetes Manual Deployment
If you prefer not to use Terraform, start Minikube manually:
```bash
minikube start --driver=docker --memory=4096 --cpus=4
kubectl apply -f k8s/databases.yml
kubectl apply -f k8s/
```

## 5. Port Forwarding
To access the Minikube deployed React Frontend and API gateway:
```bash
# Frontend
kubectl port-forward svc/frontend 3000:80
# API Gateway
kubectl port-forward svc/api-gateway 8080:8080
```
Open `http://localhost:3000` to interact with the system.
