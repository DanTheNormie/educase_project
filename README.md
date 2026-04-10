# School Administration API (Project)

A robust Node.js backend for managing school data.

## 🛠 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MySQL 8.0](https://www.mysql.com/)
- **ORM/Driver**: [mysql2](https://github.com/sidorares/node-mysql2)
- **Containerization**: [Docker](https://www.docker.com/) / [Docker Compose](https://docs.docker.com/compose/)

## 📖 API Documentation

### Base URL
`http://localhost:3000`

### Endpoints

#### 1. Add School
Adds a new school record to the database.

- **URL**: `/addSchool`
- **Method**: `POST`
- **Body Parameters**:
  - `name` (String): Name of the school.
  - `address` (String): Physical address.
  - `latitude` (Number): Latitude coordinate (-90 to 90).
  - `longitude` (Number): Longitude coordinate (-180 to 180).
- **Example Request**:
  ```json
  {
    "name": "Springfield Elementary",
    "address": "123 Evergreen Terrace",
    "latitude": 44.0519,
    "longitude": -123.0163
  }
  ```

#### 2. List Schools
Retrieves schools sorted by distance from the provided coordinates.

- **URL**: `/listSchools`
- **Method**: `GET`
- **Query Parameters**:
  - `latitude` (Number): Your current latitude.
  - `longitude` (Number): Your current longitude.
- **Response**: A JSON array of schools, each including a `distance` field in kilometers.

#### 3. Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Description**: Returns the system status and current timestamp.

---

## ⚙️ Setup & Installation

### Method 1: Using Docker (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd educase
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```
   This will start the MySQL database and the Node.js backend. The service will be available at `http://localhost:3000`.

### Method 2: Manual Setup

1. **Prerequisites**:
   - Node.js (v18+)
   - MySQL 8.0

2. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the `backend` directory (refer to `.env.example`):
   ```env
   DB_HOST=localhost
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=school_db
   PORT=3000
   ```

4. **Initialize Database**:
   ```bash
   node src/init-db.js
   ```

5. **Start the server**:
   ```bash
   npm start
   ```

## 📂 Project Structure

```text
├── backend
│   ├── src
│   │   ├── config/      # Database configuration
│   │   ├── utils.js     # Helper functions (Distance calculation)
│   │   ├── init-db.js   # Database initialization script
│   │   └── index.js     # Main application entry point
│   ├── Dockerfile       # Container definition
│   └── package.json     # Node.js dependencies
├── docker-compose.yml   # Multi-container orchestration
└── README.md            # You are here!
```

## 🛡 Security & Performance

- **Rate Limiting**: Applied to `/addSchool` to prevent spamming.
- **Input Validation**: Strict validation for coordinates and field types.
- **Error Handling**: Centralized error middleware for clean API responses.
