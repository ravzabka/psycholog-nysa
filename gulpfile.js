let gulp = require('gulp');

let config          = require('./env/lib/getProjectConfig');
let loadEnv         = require('./env/lib/loadEnv');
let fileExists      = require('./env/lib/fileExists');
let messageFromFile = require('./env/lib/messageFromFile');

/*
|--------------------------------------------------------------------------
| Verify and load configuration
|--------------------------------------------------------------------------
|
| Check if required configuration files exist.
| If some configuration files are missing display error messages letting
| the user know what the problem is.
|
*/

if (
  !fileExists('config/project.json') ||
  !fileExists('package.json')
) {
  messageFromFile('env/messages/config-missing');
  process.exit();
}

if (
  config('components.webpack') &&
  !fileExists('webpack.config.js')
) {
  messageFromFile('env/messages/webpack-config-missing');
  process.exit();
}

if (
  'wordpress' === config('project.type') &&
  (
    !fileExists('.env') ||
    !fileExists('composer.json')
  )
) {
  messageFromFile('env/messages/config-missing');
  process.exit();
}

loadEnv();

/*
|--------------------------------------------------------------------------
| Load tasks
|--------------------------------------------------------------------------
|
| In order to avoid having a very large and difficult to manage gulpfile
| tasks are set up and configured each in its own file, in gulp/tasks
| folder.
|
| To learn how tasks are loaded, and how task file structure is mapped
| to the task name read comments for env/gulp/taskLoader.js.
|
*/

let taskLoader = require('./env/gulp/taskLoader');
taskLoader('env/gulp/base');
taskLoader(`env/gulp/${config('project.type')}`);
