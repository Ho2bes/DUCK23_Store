terraform {
required_providers {
aws = {
source  = "hashicorp/aws"
version = "~> 5.92"
}
}
required_version = ">= 1.2"
}

provider "aws" {
region = "eu-west-3"
}

data "aws_ami" "ubuntu" {
most_recent = true
filter {
name   = "name"
values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
}
owners = ["099720109477"]
}

data "aws_vpc" "default" {
default = true
}

resource "aws_security_group" "app_server_sg" {
name        = "app-server-sg"
description = "Allow inbound traffic for DUCK23 Store"
vpc_id      = data.aws_vpc.default.id

ingress {
description = "Allow SSH"
from_port   = 22
to_port     = 22
protocol    = "tcp"
cidr_blocks = ["0.0.0.0/0"]
}

ingress {
description = "Allow Frontend"
from_port   = 80
to_port     = 80
protocol    = "tcp"
cidr_blocks = ["0.0.0.0/0"]
}

ingress {
description = "Allow Backend API"
from_port   = 8000
to_port     = 8000
protocol    = "tcp"
cidr_blocks = ["0.0.0.0/0"]
}

ingress {
description = "Allow Postgres"
from_port   = 5432
to_port     = 5432
protocol    = "tcp"
cidr_blocks = ["0.0.0.0/0"]
}

egress {
description = "Allow all outbound traffic"
from_port   = 0
to_port     = 0
protocol    = "-1"
cidr_blocks = ["0.0.0.0/0"]
}

tags = {
Name = "app-server-sg"
}
}

resource "aws_instance" "app_server" {
ami                    = data.aws_ami.ubuntu.id
instance_type          = "t3.micro"
key_name               = "ci-cd-deploy"
vpc_security_group_ids = [aws_security_group.app_server_sg.id]

user_data = <<-EOF
#!/bin/bash
sudo apt-get update
sudo apt-get install -y docker.io
DOCKER_CONFIG=/home/ubuntu/.docker
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL  -o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
sudo usermod -aG docker ubuntu
EOF
tags = {
Name = "duck23-server"
}
}

output "instance_public_ip" {
value = aws_instance.app_server.public_ip
}