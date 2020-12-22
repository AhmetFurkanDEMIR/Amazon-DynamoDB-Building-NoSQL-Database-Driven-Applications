#!/bin/bash

# Create VPC
echo "Creating VPC..."
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block '192.168.0.0/16' \
  --query 'Vpc.{VpcId:VpcId}' \
  --output text)
echo "  VPC ID '$VPC_ID' CREATED."

# Add Name tag to VPC
aws ec2 create-tags \
  --resources $VPC_ID \
  --tags "Key=Name,Value=edx-ddb-vpc"

# Get Main Route Table ID
MAIN_ROUTE_TABLE_ID=$(aws ec2 describe-route-tables \
  --filters Name=vpc-id,Values=$VPC_ID Name=association.main,Values=true \
  --query 'RouteTables[*].{RouteTableId:RouteTableId}' \
  --output text)
echo "  Main Route Table ID is '$MAIN_ROUTE_TABLE_ID'."

# Create Private Subnet
echo "Creating Private Subnet..."
SUBNET_PRIVATE_ID=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block '192.168.0.0/24' \
  --query 'Subnet.{SubnetId:SubnetId}' \
  --output text)
echo "  Subnet ID '$SUBNET_PRIVATE_ID' CREATED."

# Add Name tag to Private Subnet
aws ec2 create-tags \
  --resources $SUBNET_PRIVATE_ID \
  --tags "Key=Name,Value=edx-ddb-private-subnet" \

# Create Lambda Security Group
echo "Creating Security Group for Lambda..."
LAMBDA_SECURITY_GROUP_ID=$(aws ec2 create-security-group \
  --description 'Lambda Security Group' \
  --group-name 'edx-ddb-lambda-sg' \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)
echo "  Lambda Security Group ID '$LAMBDA_SECURITY_GROUP_ID' CREATED."
echo "COMPLETED"