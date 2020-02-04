#!/usr/bin/env node
const program = require('commander');
const icsa = require('../index.js');

program.version('v' + require('../package.json').version)
  .description('Manipulate icsa archive files')

program.command('pack <dir> <output>')
  .alias('p')
  .description('create icsa archive')
  .option('--key <32 byte key>', 'key for encryption (aes-256-ecb)')
  .action(async function (dir, output, options) {
    if(options.key == undefined){
      await icsa.writeICSAFile(dir, output);
    } else {
      await icsa.writeEICSAFile(dir, options.key, output);
    }
    process.exit(1)
  });

program.command('extract <archive> <dest>')
  .alias('e')
  .description('extract icsa archive')
  .option('--key <32 byte key>', 'key for encryption (aes-256-ecb)')
  .action(async function (archive, dest, options) {
    if(options.key == undefined){
      await icsa.writeICSADir(await icsa.readICSAFile(archive), dest);
    } else {
      await icsa.writeICSADir(await icsa.readEICSAFile(archive, options.key), dest);
    }
    process.exit(1)
  });

program.command('*')
  .action(function (cmd) {
    console.log('icsa: \'%s\' is not an icsa command. See \'icsa --help\'.', cmd)
  })

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
}
