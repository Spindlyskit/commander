'use strict';

exports.COMMAND_STATUS = Object.freeze({
	NoCommand: Symbol('NoCommand'),
	Success: Symbol('Success'),
	ArgError: Symbol('ArgError'),
	Failed: Symbol('Failed'),
	Error: Symbol('Error'),
});
