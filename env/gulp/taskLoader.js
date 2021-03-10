let gulp = require('gulp');
let path = require('path');
let fs   = require('fs');

/**
 * Recursively register all tasks from.
 * A task file can export a function in which case it is registered as a task.
 *
 * It can also export and object containing tasks (which can be nested). This function
 * travels the object recursively and registers all functions as tasks, that are named
 * as follows:
 * {file name}:{object property name}
 * Which can be any number of levels deep:
 * {file name}:{level 1}:{level 2}:{task name}
 *
 * In addition to that if the object property name is 'default' the task name after ':'
 * is ignored (again - that can be on any depth).
 *
 * For example, in file 'copy.js':
 * { default: () => { ... }, anotherTask: () => { ... } } will register following:
 * copy
 * copy:anotherTask
 *
 * Or in case of deeper nesting:
 * { dev: { default: () => { ... }, source: () => { ... } } } will register:
 * copy:dev
 * copy:dev:source
 *
 * @param {object} tasks  - Object containing (possibly nested) tasks to register.
 * @param {object} gulp   - Gulp instance.
 * @param {string} prefix - Parent task name (task name that should be before ':').
 */
function registerTask(tasks, gulp, prefix = '') {
  let subtasks = Object.keys(tasks);

  subtasks.forEach(subtask => {
    let task = tasks[subtask];

    if ('object' === typeof task) {
      registerTask(task, gulp, `${prefix}:${subtask}`);
    } else if ('function' === typeof task) {
      gulp.task(`${prefix}:${subtask}`, tasks[subtask]);

      if ('default' === subtask) {
        gulp.task(prefix, task);
      }
    }
  });
}

/**
 * Automatically load all tasks from the given directory.
 * If the task exports a single task (function) it will be available under the same name
 * as the file. If the task exports object, each subtask will be available under:
 * { file name }:{ subtask name }.
 * Additionally if the subtask is named 'default', it will be available under the same name
 * as the file. For example, these would be equivalent:
 * copy:default
 * copy
 *
 * @param {string} tasksPath - Path to directory containing the tasks to load.
 */
module.exports = tasksPath => {
  let configFiles = fs.readdirSync(tasksPath);

  configFiles.forEach(function (file) {
    let taskName = file.replace('.js', '');
    let task = require(path.join(process.cwd(), tasksPath, file));

    /*
     * Config file exports a single task.
     */
    if (typeof task === 'function') {
      gulp.task(taskName, task);
    }

    /*
     * Config file exports an object containing a series of tasks.
     */
    else if (typeof task === 'object') {
      registerTask(task, gulp, taskName);
    }
  });
};
