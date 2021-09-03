var v1 = require('uuid');
var jwt = require('jsonwebtoken');
var uuidv1 = v1;

// This is based on the JwtGenerator.js file in the vonage-node-sdk:
// https://github.com/Vonage/vonage-node-sdk/blob/2.x/src/JwtGenerator.js.
//
// To Do: Combine this with the generateJwt.js code
var VgJwtGenerator = function () {
};

/**
 * Generate a JSON Web Token (JWT).
 *
 * @param {Buffer} cert - the private key certificate to be used when signing
 * the claims.
 * @param {Object} claims - additional claims to include within the generated
 * JWT.
 *
 * @returns {String} the generated token
 */
VgJwtGenerator.prototype.generate = function (cert, claims) {
  var toSign;
  var token;
  if (!claims) {
    claims = {};
  }
  if (typeof claims !== 'object') {
    throw new Error('claims must be of type object');
  }

  toSign = {
    iat: claims.issuedAt || parseInt(Date.now() / 1000, 10),
    jti: claims.jti || uuidv1()
  };
  Object.keys(claims).forEach(function (key) {
    toSign[key] = claims[key];
  });

  token = jwt.sign(toSign, cert, { algorithm: 'RS256' });
  return token;
};

module.exports = VgJwtGenerator;
