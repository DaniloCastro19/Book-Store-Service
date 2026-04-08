# Book-Store-Service

NestJS service exercise for Book Store React client exercise

## Prerequisites

- Node.js 20+
- Docker & Docker Compose

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start PostgreSQL Container

```bash
docker-compose up -d
```

This starts a PostgreSQL 16 (Alpine) container with:
- **Database**: `bookstore`
- **User**: `postgres`
- **Password**: `postgres`
- **Port**: `5432`

### 3. Run Prisma Migrations & Seed

Generate the database schema and seed initial data:

```bash
npx prisma migrate dev --name init
```
Generate the prisma client dependencies:

```bash
npx prisma generate
```

### 4. Start the Application

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

## Environment Variables

The project uses the following environment variables (defined in `.env`):

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bookstore
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start the app in development mode with hot reload |
| `npm run build` | Build the application |
| `npm run lint` | Lint and fix code |
| `npm run test` | Run tests |

## Docker Commands

```bash
# Start PostgreSQL
docker-compose up -d

# Stop PostgreSQL
docker-compose down

# View logs
docker-compose logs -f postgres
```
