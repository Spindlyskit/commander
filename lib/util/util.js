'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Require all files in a directory
 * Useful for bulk registering commands and argument types
 */
exports.requireDirectory = (directory, callback) => {
	fs.readdir(directory, (err, files) => {
		if (err) {
			throw err;
		}

		files.forEach(file => {
			callback(require(path.join(directory, file)));
		});
	});
};
