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
# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}PM2 is not installed. Installing PM2...${NC}"
    npm install -g pm2
fi

# Stop existing PM2 process if running
pm2 delete student-fee-backend 2>/dev/null || true

# Start backend with PM2
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