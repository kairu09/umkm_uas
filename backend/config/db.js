import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",     
  user: "root",          
  password: "",          
  database: "db_umkm",   
});

db.connect(err => {
  if (err) {
    console.error("Koneksi database gagal ❌");
    throw err;
  }
  console.log("MySQL Connected ✅");
});

export default db;
