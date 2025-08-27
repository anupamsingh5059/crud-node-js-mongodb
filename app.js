const http = require("http");
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
let db, users;

async function connectDB() {
  await client.connect();
  db = client.db("myDb");
  users = db.collection("users");
  console.log("✅ MongoDB Connected");
}
connectDB();

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    // Fetch data from MongoDB
    const allUsers = await users.find().toArray();

    // Create HTML table dynamically
    let tableRows = allUsers
      .map(
        (user) =>
          `<tr><td>${user._id}</td><td>${user.name}</td><td>${user.email}</td></tr>`
      )
      .join("");

    const html = `
      <html>
      <head>
        <title>MongoDB Data Table</title>
        <style>
          table { border-collapse: collapse; width: 70%; margin:auto; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2 style="text-align:center">Users Table</h2>
        <table>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
          ${tableRows}
        </table>
      </body>
      </html>
    `;

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  }
});

server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
