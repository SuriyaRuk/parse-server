// Tools for encrypting and decrypting passwords.
// Basically promise-friendly wrappers for bcrypt.
var pbkdf2 = require('pbkdf2');
//var bcrypt = require('bcryptjs');
/*
try {
  const _bcrypt = require('@node-rs/bcrypt');
  bcrypt = {
    hash: _bcrypt.hash,
    compare: _bcrypt.verify,
  };
} catch (e) {
  * *
}
*/
// Returns a promise for a hashed password string.
function hash(password) {
  //return bcrypt.hash(password, 10);
  const salt =
    process.env.SALT ||
    'zPk06xSLopMLEYcl9YMkThajWcjtXxHM5KF8U9UK/Bs9VV1j+uQIRq5X+356IkRABk7IWJBQI87Y';
  console.debug(salt);
  return pbkdf2.pbkdf2Sync(password, salt, 1024, 64, 'sha512').toString('hex');
}

// Returns a promise for whether this password compares to equal this
// hashed password.
function compare(password, hashedPassword) {
  // Cannot bcrypt compare when one is undefined
  if (!password || !hashedPassword) {
    return Promise.resolve(false);
  }
  //return bcrypt.compare(password, hashedPassword);
  hash(password) === hashedPassword;
}

module.exports = {
  hash: hash,
  compare: compare,
};

Promise.resolve(hash('password')).then(function (v) {
  console.log('Hashed: ' + v);
});

Promise.resolve(
  compare(
    'password',
    'f8c687132809100526250d0884dc440555dbf8425a9ff947029538c36c602731d9a716c88f96c97e48c3075f7410e5705eeacc9b082758cb2d524d83e674db0e'
  )
).then(function (v) {
  console.log('Valid = ' + v);
});
