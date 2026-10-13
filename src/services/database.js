import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('shop.db');

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      total REAL NOT NULL,
      items_count INTEGER NOT NULL,
      latitude REAL,
      longitude REAL
    );
  `);
};

export const findUserByEmail = (email) => {
  return db.getFirstSync('SELECT id, name, email, password FROM users WHERE email = ?;', [email]);
};

export const createUser = ({ name, email, password }) => {
  db.runSync(
    `
      INSERT INTO users (name, email, password, created_at)
      VALUES (?, ?, ?, ?);
    `,
    [name, email, password, new Date().toISOString()]
  );
  return findUserByEmail(email);
};

export const createOrder = ({ customerName, customerEmail, total, itemsCount, latitude, longitude }) => {
  db.runSync(
    `
      INSERT INTO orders (created_at, customer_name, customer_email, total, items_count, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
    [new Date().toISOString(), customerName, customerEmail, total, itemsCount, latitude, longitude]
  );
};

export const listOrdersByEmail = (email) => {
  return db.getAllSync('SELECT * FROM orders WHERE customer_email = ? ORDER BY id DESC;', [email]);
};
