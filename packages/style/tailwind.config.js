const globals = require('./output/global.json');
const { filterTokensByType } = require("./fns");

const colors = filterTokensByType('color', globals);

module.exports = {
    theme: {
      colors,
    },
    variants: {},
    plugins: [],
}
