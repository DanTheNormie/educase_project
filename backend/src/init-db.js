const db = require("./config/db");

const initDb = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.query(createTableQuery);
    console.log("Database initialized: 'schools' table ready.");
    process.exit(0);
  } catch (err) {
    console.error("Database initialization failed:", err.message);
    process.exit(1);
  }
};

initDb();
