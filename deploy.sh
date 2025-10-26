#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Deploying Student Fee Management System...${NC}"

# Backend deployment
echo -e "\n${GREEN}Deploying backend...${NC}"
cd backend

echo "Installing backend dependencies..."
npm install

echo "Building backend..."
npm run build

echo "Starting backend service..."
pm2 delete student-fee-backend || true
pm2 start dist/index.js --name student-fee-backend

# Frontend deployment
echo -e "\n${GREEN}Deploying frontend...${NC}"
cd ../frontend

echo "Installing frontend dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Deploying to GitHub Pages..."
npm run deploy

echo -e "\n${GREEN}Deployment complete!${NC}"
echo -e "Backend is running on http://localhost:5000"
echo -e "Frontend is deployed to GitHub Pages"