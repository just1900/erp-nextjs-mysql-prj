const url = require('url');

const connectionString = "mysql://2MaWG9N4LmsCZSe.root:l9hn%2316Dbh@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/erp?sslaccept=strict";

try {
  const parsed = new url.URL(connectionString);
  console.log('Protocol:', parsed.protocol);
  console.log('Username:', parsed.username);
  console.log('Hostname:', parsed.hostname);
  console.log('Port:', parsed.port);
  console.log('Pathname:', parsed.pathname);
  console.log('Search:', parsed.search);
} catch (e) {
  console.error('URL parsing failed:', e.message);
}

// Test with mysql2 driver to see if it connects
const mysql = require('mysql2');
const connection = mysql.createConnection("mysql://2MaWG9N4LmsCZSe.root:l9hn#16Dbh@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/erp?sslaccept=strict");

connection.connect((err) => {
  if (err) {
    console.error('mysql2 connection failed:', err.message);
  } else {
    console.log('mysql2 connection successful!');
  }
  process.exit();
});
