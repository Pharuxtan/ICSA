module.exports = async (dirpath) => {
  const { compress } = require('iltorb');
  const fs = require("fs");
  const path = require("path");
  let buf = Buffer.alloc(0);
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
    buf = Buffer.concat([buf, Buffer.from(Array.from(str).map(n => n.charCodeAt()))]);
  }

  function addBuffer(buffer){
    buf = Buffer.concat([buf, buffer]);
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

  return buf;
}
