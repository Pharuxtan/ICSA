const BinaryReader = require("./lib/BinaryReader");
const { decompress } = require('compress-brotli')();
const fs = require("fs");

module.exports = async (file) => {
  return await ICSA.create(file);
}

class ICSA {
  constructor() { }

  async initialize(file) {
    try {
      this.file = fs.readFileSync(file);
      let reader = new BinaryReader(this.file);
      this.magic = reader.ReadAscii(4);
      if(this.magic !== "ICSA") return this.error = "Not an ICSA File";
      this.dir = {};
      let d = "";
      while(true){
        let type = reader.ReadAsciiZ();
        let name = reader.ReadAsciiZ();
        if(type == "D"){
          this.dir[name] = {};
          d = name;
        } else if(type == "F"){
          let size = reader.ReadInt64();
          if(size == 0){
            this.dir[d][name] = Buffer.alloc(0);
          } else {
            this.dir[d][name] = await decompress(this.file.slice(reader.position, reader.position + size));
            reader.position += size;
          }
        } else {
          break;
        }
      }
     } catch(e) {
       return this.error = e;
     }
     return this.error = null;
  }

  static async create(file) {
     const o = new ICSA();
     await o.initialize(file);
     return o;
  }
}
