let StringDecoder = require('string_decoder').StringDecoder;

/**
 * Parameters
 */

// Size of bytes that can be processed at once,
// this parameter is responsible for length of the processed string,
// higher value the longer text is passed to processTextBefore()
let processingLength = 1024;

// Number of bytes to read from file at once
// Must be a multiple of one encoded character
let readSize = 64;

// Input buffer size
// let inputBufferSize = processingLength * 10;
let inputBufferSize = 10000000;

// Output buffer size
// let outputBufferSize = inputBufferSize;
let outputBufferSize = 10000000;

/**
 * Code start here
 */
let fs = require('fs'),
  _ = require('underscore');

module.exports = (filePath, substitutions, outputPath) => {
  // Prepare regexp tests
  substitutions = _.map(substitutions, s => {
    return {
      test: new RegExp(escapeRegExp(s[0])),
      replace: s[1]
    }
  });

  // Open file
  let fd = fs.openSync(filePath, 'r');
  let od = fs.openSync(outputPath, 'w');

  // Buffers
  let inputBuffer = new Buffer(inputBufferSize);
  let outputBuffer = new Buffer(outputBufferSize);

  // Initials
  let readPosition = 0;
  let inputOffset = 0;
  let outputOffset = 0;
  let processingOffset = 0;

  // Read and process
  let read;
  while (read = fs.readSync(fd, inputBuffer, inputOffset, readSize, readPosition)) {
    // Increment position
    readPosition += read;

    // Increment offset
    inputOffset += read;

    // Perform all text processing
    let text = (new StringDecoder('utf8')).write(inputBuffer.slice(processingOffset, inputOffset));
    let textBytes = Buffer.byteLength(text);

    let match = null;

    // Perform every substitution
    _.each(substitutions, s => {
      while (match = s.test.exec(text)) {
        let slice = match[0];

        writeToOutput(processTextBefore(text.slice(0, match['index']), slice.length - s.replace.length));
        writeToOutput(s.replace);

        // Update the text
        text = text.slice(match['index'] + match[0].length);
      }
    });

    // Increment processingOffset
    processingOffset += textBytes - Buffer.byteLength(text);

    // Shorten the text if is too long
    let overflow = inputOffset - processingOffset - processingLength;
    if (overflow > 0) {
      // Shrink the buffer
      let text = (new StringDecoder('utf8')).write(inputBuffer.slice(processingOffset, processingOffset + overflow))
      writeToOutput(text);
      processingOffset += Buffer.byteLength(text);
    }

    // If we are near the buffer end then realocate everything
    if (inputBuffer.length < inputOffset + readSize) {
      inputOffset = inputBuffer.write(inputBuffer.toString('utf8', processingOffset, inputOffset), 0);
      processingOffset = 0;
    }
  }

  // Close the file
  fs.closeSync(fd);

  // Add leftover text to output - it was processed already
  writeToOutput(inputBuffer.toString('utf8', processingOffset, inputOffset));
  flushOutput();


  /**
   * Helper function - escapes string for use in regexp
   */
  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  /**
   * Processes the text, searches for a last
   * serialized string definition and edits it.
   */
  function processTextBefore(before, diff) {
    let re = new RegExp("s:(\\d+):", "g")
    let match = null, _match = null;
    while ((_match = re.exec(before)) !== null) {
      match = _match;
    }

    if (match && match['index'] + parseInt(match[1]) > before.length) {
      before = before.slice(0, match['index']) + 's:' + (parseInt(match[1]) - diff) + ':' + before.slice(match['index'] + match[0].length);
    }

    return before
  }

  /**
   * Helper function - buffered output
   */
  function writeToOutput(text) {
    if (outputOffset + Buffer.byteLength(text) > outputBuffer.length) {
      flushOutput();
    }

    outputOffset += outputBuffer.write(text, outputOffset, Buffer.byteLength(text));
  }

  /**
   * Helper function - flushed the output buffer
   */
  function flushOutput() {
    fs.writeSync(od, outputBuffer.toString('utf8', 0, outputOffset));
    outputOffset = 0;
  }
};
