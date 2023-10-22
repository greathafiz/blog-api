import mongoose from "mongoose";

const connectDB = (uri) => {
  return mongoose.connect(uri)
}

export default connectDB







/* import pg from "pg";

const { Client } = pg

const client = new Client({
  user: "postgres",
  host: "localhost",
  password: process.env.DB_PASS,
  port: 5432,
  database: "BlogDB",
});

export default client */