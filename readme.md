# fred

fred is a personal finance app built with nestjs and react.

## Getting Started

### Prerequisites

- Node.js
- pnpm
- docker

## Install required software
### pnpm
We use PNPM to manage node dependencies accoss the frontend and the backend. Use the following link to install it:
https://pnpm.io/installation

### Docker
We use Docker to host the PostgreSQL database for the backend. Use the following link to install it:
https://docs.docker.com/get-docker/

## Clone the repository
```
git clone https://github.com/fred-finance/fred.git
```

### Install dependencies
PNPM is capable of installing dependencies for both the frontend and the backend with the following command:
```
pnpm install
```

## Run the application
The frontend and backend run on different ports. The frontend runs on port 3000 and the backend runs on port 4590. Create two terminal sessions to run each application.

### Run the frontend
```
cd frontend
pnpm run dev
```

### Run the database
```
docker compose up -d
```
Before running the backend for the first time, you will need to apply the migrations:
```
cd backend
pnpm run db:refresh
```

Use this command whenever you change the Prisma schema, pull the latest changes, or want to reset the database.

### Run the backend
```
cd backend
pnpm run dev
```

## Environment variables
The frontend and backend each have their own environment variables. The .env.example files in each directory contain the variables that need to be set. Copy the .env.example file to a new file called .env and set the variables.
