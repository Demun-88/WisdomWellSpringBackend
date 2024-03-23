const crypto = require('crypto');

const stri = crypto.randomBytes(64).toString('hex');

console.log(stri);