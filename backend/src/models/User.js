const db = require("../config/db");

const createUser = (userData, callback) => {
  const sql =
    "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [
      userData.full_name,
      userData.email,
      userData.password,
      userData.role || "farmer"
    ],
    callback
  );
};

const findUserByEmail = (email, callback) => {
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    callback
  );
};

module.exports = {
  createUser,
  findUserByEmail
};