module.exports = async (dirpath) => {
  const { compress } = require('compress-brotli')();
  const fs = require("fs");
  const path = require("path");
  let buf = [];
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
    let temp = Array.from(str).map(n => n.charCodeAt());
    for(var i=0; i<temp.length; i++){
      buf.push(temp[i]);
    }
  }

  function addBuffer(buffer){
    for(var i=0; i<buffer.length; i++){
      buf.push(buffer[i]);
    }
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

  return Buffer.from(buf);
}
