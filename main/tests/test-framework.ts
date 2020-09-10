import chai from 'chai';

// This is juts to avoid defining on everyfile certain variables
chai.includeStack = true;

global.assert = chai.assert;
global.expect = chai.expect;
