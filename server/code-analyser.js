
const bodyParser = require("body-parser");
const express = require('express');
const multer = require("multer");
const cors = require("cors");
const app = express();
const fs = require("fs");

const CodeFileArray = require("./objects/code-file-array.js");

const multerOptions = {
  dest: './uploads/',
  putSingleFilesInArray: true,

  rename: (field, filename, req, res) => {
    return filename;
  },

  changeDest: (dest, req, res) => {
    req.body = req.body || {};
    req.body.dir = `${dest + req.headers.id}`;

    if(!fs.existsSync(req.body.dir))
    fs.mkdirSync(req.body.dir);

    return req.body.dir;
  }
};

app.use(multer(multerOptions));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  const debugHtml = `
  <html>
    <body>
      <h1>Server online</h1>
    </body>
  </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.write(debugHtml);
  res.end();
});

app.post('/', (req, res) => {
  if(req.body.dir) {
    fs.readdir(req.body.dir, (err, data)  => {
      if(err) {
        res.json({ "err": err });
      } else {
        const fileArray = new CodeFileArray(req.body.dir);
        fileArray.readFiles(`${req.body.dir}/`, data, () => {
          fileArray.analyse();
          fileArray.clearup();

          res.json({ "analysis": fileArray.toArray() });
        });
      }
    });
  } else {
    res.json({ "err": "You didn't provide any files." });
  }
});

const server = app.listen(3001, () => {
  const address = server.address();

  if(!fs.existsSync("./uploads"))
  fs.mkdirSync("./uploads");

  console.log(`Server listening at http://${address.address}:${address.port}`);
});
