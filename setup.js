/*
 |--------------------------------------------------------------------------
 | Project setup
 |--------------------------------------------------------------------------
 |
 | Environment requires some configuration files to be present. However,
 | because we want to be able to update the environment in project already
 | under development without overriding users setting, these configuration
 | files are not present in the generator, and need to be generated
 | before starting to work on the project.
 |
 */

let fs         = require('fs');
let fileExists = require('./env/lib/fileExists');

// Envinronment configuration
if (!fileExists('.env')) {
  fs.createReadStream('.env.example')
    .pipe(fs.createWriteStream('.env'));
}

// Project settings
if (!fileExists('config/project.json')) {
  fs.createReadStream('env/configs/project.example.json')
    .pipe(fs.createWriteStream('config/project.json'));
}

if (!fileExists('config/local.json')) {
  fs.createReadStream('env/configs/local.example.json')
    .pipe(fs.createWriteStream('config/local.json'));
}

if (!fileExists('config/sprites.json')) {
  fs.createReadStream('env/configs/sprites.example.json')
    .pipe(fs.createWriteStream('config/sprites.json'));
}

if (!fileExists('config/summary.json')) {
  fs.createReadStream('env/configs/summary.example.json')
    .pipe(fs.createWriteStream('config/summary.json'));
}

if (!fileExists('webpack.config.js')) {
  fs.createReadStream('env/configs/webpack.config.js')
    .pipe(fs.createWriteStream('webpack.config.js'));
}

// Dependencies
if (!fileExists('package.json')) {
  fs.createReadStream('env/configs/package.json')
    .pipe(fs.createWriteStream('package.json'));
}

if (fileExists('env/configs/composer.json') && !fileExists('composer.json')) {
  fs.createReadStream('env/configs/composer.json')
    .pipe(fs.createWriteStream('composer.json'));
}

console.log('Project set up!');
