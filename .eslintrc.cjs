
module.exports = {
  root: true,
  extends: 'eslint-config-egg',
  rules: {
    'no-unused-vars': 'off', // 禁止使用未声明的变量
    'jsdoc/require-param-description': 'off', // 禁止未描述的参数
    'jsdoc/require-param-type': 'off', // 禁止未描述的参数类型
    'jsdoc/require-param': 'off', // 禁止未描述的参数
    // 'jsdoc/require-returns-description': 'off', // 禁止未描述的返回值
    // 'jsdoc/require-returns-type': 'off', // 禁止未描述的返回值类型
  },
};
