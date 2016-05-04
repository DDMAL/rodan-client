/* */ 
var mochaGlobals = require('.globals.json!systemjs-json').globals;
window.mocha.setup('bdd');
window.onload = function() {
  window.mocha.checkLeaks();
  window.mocha.globals(Object.keys(mochaGlobals));
  window.mocha.run();
  require('./setup')(window);
};
