
const CodeFile = require("./code-file");
const async = require("async");
const fs = require("fs");

class CodeFileArray {
  constructor(directory) {
    this.dir = directory;
    this.analysis = {};
    this.files = [];
  }

  analyse() {
    this.analysis['Total Files'] = this.files.length;
    this.analysis['Total Files Size'] = this.getTotalFileSize();
    this.analysis['Total Line Count'] = this.getTotalLineCount();
    this.analysis['Total Characters'] = this.getTotalCharacterCount();
    this.analysis['Total Classes'] = this.getTotalClassesCount();
    this.analysis['Biggest File'] = this.getBiggestFile();
    this.analysis['Smallest File'] = this.getSmallestFile();
  }

  clearup () {
    const deleteFolderRecursive = (path) => {
      fs.readdirSync(path).forEach((file, index) => {
        const currentPath = `${path}/${file}`;
        if(fs.lstatSync(currentPath).isDirectory()) {
          deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(currentPath);
        }
      });

      fs.rmdirSync(path);
    };

    deleteFolderRecursive(this.dir);
  };

  readFiles(directory, filenames, callback) {
    const iterator = (iterator, next) => {
      const codeFile = new CodeFile()
      codeFile.openFile(directory + iterator, () => {
        this.files.push(codeFile);
        next();
      });
    };

    async.each(filenames, iterator, () => callback());
  }

  getTotalClassesCount() {
    let classes = 0;
    this.files.forEach(file => {
      classes += file.classes;
    });
    return classes;
  };

  toArray() {
    const array = [];
    const keys = Object.keys(this.analysis);
    keys.forEach(key => {
      array.push({
        'key': key,
        'value': this.analysis[key]
      });
    });
    return array;
  };

  getTotalFileSize() {
    let totalSize = 0;
    this.files.forEach(file => totalSize += file.stats.size);
    return `${(totalSize / 1000).toFixed(2)} kb`;
  }

  getBiggestFile() {
    let biggestFile = null;
    this.files.forEach(file => {
      if(biggestFile == null || biggestFile.stats.size < file.stats.size) {
        biggestFile = file;
      }
    });
    return biggestFile ? biggestFile.filename : 'N/A';
  }

  getSmallestFile() {
    let smallestFile = null;
    this.files.forEach(file => {
      if(smallestFile == null || smallestFile.stats.size > file.stats.size) {
        smallestFile = file;
      }
    });
    return smallestFile ? smallestFile.filename : 'N/A';
  }

  getTotalLineCount() {
    let totalLines = 0;
    this.files.forEach(file => {
      totalLines += file.lines;
    });
    return totalLines;
  }

  getTotalCharacterCount() {
    let totalCharacters = 0;
    this.files.forEach(file => {
      totalCharacters += file.characters;
    });
    return totalCharacters;
  }
}

module.exports = CodeFileArray;
