const bcryptjs = require('bcryptjs');

/**
 * 加密
 * @param {*} password 明文密码
 * returns 加密后的密码
 */
const bcryptHash = password => {
  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(password, salt);
  return hash;
};

/**
 * 解密
 * @param {*} password 明文密码
 * @param {*} hash 加密后的密码
 * returns true 或者 false
 */
const bcryptCompare = (password, hash) => {
  const result = bcryptjs.compareSync(password, hash);
  return result;
};

module.exports = {
  bcryptHash,
  bcryptCompare,
};
