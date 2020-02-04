const read = require("./read.js");
const fs = require("fs");
const path = require("path");

module.exports = async (icsa, dir) => {
  if(icsa.constructor == undefined) icsa = await read(icsa);
  if(icsa.constructor.name !== "ICSA" || icsa.dir == undefined) return "This is not an ICSA Class";
  icsa = icsa.dir;
  let dirs = Object.keys(icsa);
  for(var d=0; d<dirs.length; d++){
    let di = dirs[d];
    if(!fs.existsSync(path.join(dir, di))) fs.mkdirSync(path.join(dir, di));
    let files = Object.keys(icsa[di]);
    for(var f=0; f<files.length; f++){
      fs.writeFileSync(path.join(dir, di, files[f]), icsa[di][files[f]], "utf8");
    }
  }
  return `dir "${dir}" created`;
}
