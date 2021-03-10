let fs       = require('fs-extra');
let glob     = require('glob-array');
let archiver = require('archiver');

class Archive {

  /**
   * Initialize Archive.
   *
   * @param {string} destination - Destination folder.
   * @param {string} filename    - Archive filename (with extension).
   */
  constructor(destination, filename) {
    this.destination = destination;
    this.filename = `${destination}/${filename}`;
    this.archive = null;

    this.createArchive();
  }

  /**
   * Create archiver instance.
   */
  createArchive() {
    let output = fs.createWriteStream(this.filename);
    this.archive = archiver('zip', { store: true });

    this.archive.on('error', function (error) {
      console.log(`Error when creating filepack: ${error}`);
      process.exit();
    });

    this.archive.pipe(output);
    fs.removeSync(`${process.cwd()}/.tmp`);
  }

  /**
   * Add files from a glob to the archive.
   * Node Archiver does support globs, but cannot add them to arbitrary custom folders.
   * This function does that by first copying the files into temporary directory,
   * and then just using Archiver "directory" function to add files to the archive.
   *
   * @param {array}  patterns    - Globs used to gather files.
   * @param {string} cwd         - cwd for glob.
   * @param {string} destination - Target directory where files should land.
   */
  add(patterns, cwd, destination) {
    let files = glob.sync(patterns, { cwd });
    files.forEach(file => {
      fs.copySync(`${cwd}/${file}`, `${process.cwd()}/.tmp/${destination}/${file}`);
    });

    this.archive.directory(
      `${process.cwd()}/.tmp/${destination}`,
      destination
    );
  }

  /**
   * Save the archive file.
   */
  save() {
    this.archive.finalize();
  }
}

module.exports = Archive;
