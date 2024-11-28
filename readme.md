# fred

fred is a personal finance app built with nestjs and react.

## Demo 

[Video Demo](https://www.youtube.com/watch?v=lvusZ2e1wxU)

## Getting Started

### Prerequisites

- Node.js (>v20)
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

Successfully starting the frontend looks like this:

![Screenshot 2024-09-29 at 4 40 51 PM](https://github.com/user-attachments/assets/95f40373-58ca-48db-aa7b-85d2d82a64ce)


### Run the database
```
docker compose up -d
```


Successfully startiung the Docker containers looks like this:

![Screenshot 2024-09-29 at 4 42 06 PM](https://github.com/user-attachments/assets/a85a930f-d4a7-4097-85e6-04021534fc8e)

Before running the backend for the first time, you will need to apply the migrations:
```
cd backend
pnpm run db:refresh
```

Successfully running the migrations looks like this:

![Screenshot 2024-09-29 at 4 42 54 PM](https://github.com/user-attachments/assets/aa6904f6-76f4-4067-a298-74983c5677eb)


Use this command whenever you change the Prisma schema, pull the latest changes, or want to reset the database.

### Run the backend
```
cd backend
pnpm run dev
```
Successfully starting the backend looks like this:


![Screenshot 2024-09-29 at 4 41 16 PM](https://github.com/user-attachments/assets/1a27b16d-1d36-49d1-9cd8-e243300a3dbe)

## Environment variables
The frontend and backend each have their own environment variables. The .env.example files in each directory contain the variables that need to be set. Copy the .env.example file to a new file called .env and set the variables.

### Documentation to read


- [Prisma](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-postgresql)
- [NestJS](https://docs.nestjs.com/)
- [TailwindCSS](https://tailwindcss.com/docs/installation)
- [NextJS](https://nextjs.org/docs)
