const fs = require('fs');
const yargs = require('yargs');

// Would be passed to the script like this:
// `ts-node config.ts --env=dev`
const environment = yargs.argv.env ?? 'dev';

// Set production flag
const isProd = environment === 'prod';

const targetPath = `./src/environments/environment.ts`;
const envConfigFile =
  `export const environment = {
    production: ${isProd},
    apiBaseUrl: 'https://${environment}-api.sinilinx.com'
};`;

fs.writeFile(targetPath, envConfigFile, function(err: NodeJS.ErrnoException) {
  if (err) {
    console.log(err);
  }

  console.log(`Output generated at ${targetPath}`);
});
