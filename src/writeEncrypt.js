const { compress } = require('iltorb');
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

module.exports = async (dirpath, key, filepath) => {
  if(filepath == undefined || filepath == null) filepath = path.join(dirpath, "..")+"\\"+path.basename(dirpath)+".icsa";
  fs.writeFileSync(filepath+".tmp", "", "utf8");
  let stream = fs.createWriteStream(filepath+".tmp");
  addString("ICSA");
  let dirs = getDirectories(dirpath);
  for(var f=0; f<dirs.length; f++){
    addString(`D\0${dirs[f]}\0`);
    let files = getFiles(path.join(dirpath, (dirs[f] == "/") ? "" : dirs[f]));
    for(var i=0; i<files.length; i++){
      addString(`F\0${path.basename(files[i])}\0`);
      let stats = fs.statSync(files[i]);
      if(stats["size"] == 0){
        let buffer = Buffer.alloc(0x8);
        buffer.writeBigInt64LE(BigInt(0), 0);
        addBuffer(buffer);
      } else {
        let br = await compress(fs.readFileSync(files[i]));
        let buffer = Buffer.alloc(0x8);
        buffer.writeBigInt64LE(BigInt(br.length), 0);
        addBuffer(buffer);
        addBuffer(br);
      }
    }
  }
  addString("E\0");

  function addString(str){
    buf = stream.write(Buffer.from(Array.from(str).map(n => n.charCodeAt())));
  }

  function addBuffer(buffer){
    buf = stream.write(buffer);
  }

  function getFiles(dir, files_) {
    files_ = files_ || [];
    if(fs.existsSync(dir)) {
      var files = fs.readdirSync(dir);
      for(var i in files) {
        var name = dir + '/' + files[i];
        if(!fs.statSync(name).isDirectory()) {
          files_.push(name);
        }
      }
    }
    return files_;
  }

  function getDirectories(dir, dirs_){
    dirs_ = dirs_ || ["/"];
    if(fs.existsSync(dir)){
      var files = fs.readdirSync(dir);
      for(var i in files){
        var name = dir + '/' + files[i];
        if(fs.statSync(name).isDirectory()){
          dirs_.push(dir.replace(dirpath, "")+"/"+files[i]);
          getDirectories(name, dirs_)
        }
      }
    }
    return dirs_;
  }

  stream.end();

  const cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.alloc(16, 0));
  let icsatmp = fs.createReadStream(filepath+".tmp");
  let icsa = fs.createWriteStream(filepath);

  icsatmp.pipe(cipher).pipe(icsa);

  fs.unlinkSync(filepath+".tmp");

  return `file "${filepath}" created`;
}
