/*******************************************************************************
 * POSTINSTALL
 ******************************************************************************/
console.log();
console.log('****************************************************************');
console.log('* ' + process.env.npm_package_name + '@' + process.env.npm_package_version);
console.log('* ' + process.env.npm_package_description);
console.log('*');
console.log('* To build for distribution:');
console.log('* 		npm run dist');
console.log('*');
console.log('* For a production distribution, the build will be saved in a directory called "dist".')
console.log('* Make a copy of "configuration.example.json" called "configuration.json" and fill in the appropriate fields.');
console.log('* It should be located in the same location as the distribution files.');
console.log('*');
console.log('*');
console.log('* To develop (with webserver):');
console.log('* 		npm start');
console.log('*');
console.log('* If developing, you will need a valid configuration file in the project root.');
console.log('* Make a copy of "configuration.example.json" called "configuration.json" and fill in the appropriate fields.');
console.log('****************************************************************');
console.log();