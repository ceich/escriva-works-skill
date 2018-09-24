// use strict

var fs = require('fs');
var mysql = require('mysql');

function sanitize(text) {
  var tagRe = /<\/?\w+>/gi; // Alexa barfs on non-SSML tags like <I>
  return text.replace(tagRe, '');
}

function dumpSomeTables(locale) {
  var data = {};
  dumpBooks(locale, data);
}

function dumpBooks(locale, data) {
  connection.query(`select id, titulo as title from ${locale}_libros`,
    function(err, results, fields) {
      if (err) throw err;
      // console.log(fields);
      for (let row of results) {
        data[row.id] = { name: row.title }
      }
      dumpDescriptions(locale, data);
    }
  );
}

function dumpDescriptions(locale, data) {
  connection.query(`select substr(Tipo,2,1) as bookId, Texto as description 
    from ${locale}_fijos where Tipo like 'h%' order by bookId`,
    function(err, results, fields) {
      if (err) throw err;
      // console.log(fields);
      for (let row of results) {
        data[row.bookId].description = sanitize(row.description);
      }
      dumpPoints(locale, data);
    }
  );
}

function dumpPoints(locale, data) {
  connection.query(`select idlibro as bookId, punto as point, texto as text 
    from ${locale}_puntos`,
    function(err, results, fields) {
      if (err) throw err;
      // console.log(fields);
      for (let row of results) {
        data[row.bookId][row.point] = sanitize(row.text);
      }
      writeFile(locale, data);
    }
  );
}

function writeFile(locale, data) {
  var outfile = 'data-' + locale + '.js';
  fs.writeFile(outfile,
    'module.exports = ' + JSON.stringify(data, null, 2) + ';\n',
    function (err) {
      if (err) throw err;
      console.log('Saved ' + outfile);
      connection.end();
    }
  );
}

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DUMPER_PASSWORD,
  database: 'escrivaworks'
});

dumpSomeTables('en');
