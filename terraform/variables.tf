variable "cluster_name" {
  description = "Name of the local kubernetes cluster"
  type        = string
  default     = "patient-minikube"
}

variable "k8s_manifests_path" {
  description = "Path to the Kubernetes YAML manifests"
  type        = string
  default     = "../k8s"
}
