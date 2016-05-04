/* */ 
var assert = require('assert-plus');
var crypto = require('crypto');
module.exports = {
  verifySignature: function verifySignature(parsedSignature, pubkey) {
    assert.object(parsedSignature, 'parsedSignature');
    assert.string(pubkey, 'pubkey');
    var alg = parsedSignature.algorithm.match(/^(RSA|DSA)-(\w+)/);
    if (!alg || alg.length !== 3)
      throw new TypeError('parsedSignature: unsupported algorithm ' + parsedSignature.algorithm);
    var verify = crypto.createVerify(alg[0]);
    verify.update(parsedSignature.signingString);
    return verify.verify(pubkey, parsedSignature.params.signature, 'base64');
  },
  verifyHMAC: function verifyHMAC(parsedSignature, secret) {
    assert.object(parsedSignature, 'parsedHMAC');
    assert.string(secret, 'secret');
    var alg = parsedSignature.algorithm.match(/^HMAC-(\w+)/);
    if (!alg || alg.length !== 2)
      throw new TypeError('parsedSignature: unsupported algorithm ' + parsedSignature.algorithm);
    var hmac = crypto.createHmac(alg[1].toUpperCase(), secret);
    hmac.update(parsedSignature.signingString);
    return (hmac.digest('base64') === parsedSignature.params.signature);
  }
};
