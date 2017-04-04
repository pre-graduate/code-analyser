
String.prototype.occurrences = function(subString) {
  let n=0, pos=0, loop = this.length > 0 && subString.length > 0;
  while(loop) {
    pos = this.indexOf(subString, pos);
    if(pos >= 0){
      pos += subString.length;
      n++;
    } else {
      break;
    }
  }
  return(n);
};

String.prototype.lines = function() {
  return 1 + this.occurrences("\n");
};

const fs = require("fs");

class CodeFile {
  constructor() {
    this.open = false;
    this.filename = "";
    this.characters = 0;
    this.classes = 0;
    this.lines = 0;
  }

  openFile(filename, callback) {
    fs.readFile(filename, (err, data) => {
      if(err) {
        throw err;
      } else {
        let contents = data.toString();

        this.stats = fs.statSync(filename);
        this.characters = contents.length;
        this.filename = filename.replace(/^.*[\\\/]/, '');
        this.contents = contents;
        this.classes = contents.occurrences("class ");
        this.lines = contents.lines();
        this.open = true;

        callback();
      }
    });
  }
}

module.exports = CodeFile;
