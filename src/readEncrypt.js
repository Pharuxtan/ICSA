const BinaryReader = require("./lib/BinaryReader");
const { decompress } = require('iltorb');
const fs = require("fs");
const crypto = require("crypto");

module.exports = async (file, key) => {
  return await ICSA.create(file, key);
}

class ICSA {
  constructor() { }

  async initialize(file, key) {
    try {
      let icsa = fs.readFileSync(file);
      this.key = key;
      let decryptfile = await decrypt(icsa, this.key);
      let reader = new BinaryReader(decryptfile);
      this.magic = reader.ReadAscii(4);
      if(this.magic !== "ICSA"){
        return this.error = "Not an ICSA File"
      };
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
            this.dir[d][name] = await decompress(decryptfile.slice(reader.position, reader.position + size));
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

  static async create(file, key) {
     const o = new ICSA();
     await o.initialize(file, key);
     return o;
  }
}

async function decrypt(file, key){
  return new Promise(function(resolve, reject) {
    const decipher = crypto.createDecipheriv('aes-256-ecb', key, Buffer.alloc(0));

    let decrypted = [];
    decipher.on('readable', () => {
      while (null !== (chunk = decipher.read())) {
        decrypted.push(chunk);
      }
    });
    decipher.on('end', () => {
      resolve(decrypted[0]);
    });

    decipher.write(file.toString("hex"), "hex");
    decipher.end();
  });
}
