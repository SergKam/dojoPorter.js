/**
 * Created by sergkam on 10.07.14.
 */
var fs = require("fs");
var fileName = process.argv[2]; 
var outputName = process.argv[3] || fileName;

if (!fileName) {
    console.log('\nThis script change the old namespace approach to new one, module orientated. ');
    console.log('It findes all dojox.someModule.SomeThing() and change it to SomeThing(),\n' +
        ' and then adds "dojox/someModule/SomeThing" to the requirements of module.\n');
    console.log('Usage: node ' + process.argv[1] + ' inputfile.js [output.js]\n');
    return 0;
}

if (!fs.existsSync(fileName)) {
    console.log('\nFile not found:' + filename);
    return 0;
}

var text = fs.readFileSync(fileName, {encoding: 'UTF-8'}),
    dojoxReg = /(dojox|dijit)(\.(\w+))+/,
    defineRegexp = /define\(\[((.|\n)*?)\](\s|\n)*?,(\s|\n)*?function(\s|\n)*?\(((.|\n)*?)\)(\s|\n)*?\{/m,
    out = [],
    isFound = false;

console.log('\n\nFile: ' + fileName);

var isDefine = defineRegexp.exec(text);
if (!isDefine) {
    console.log('This is not a module with define(), skip it');
    return 0;
}

var dependency = isDefine[1].replace(/[\s|\n]/gm, '').split(',');

//checking current state
var paramsFromMod = modulesToParams(dependency).join(',');
var paramsOldStr = defineRegexp.exec(text)[6].replace(/[\s|\n]/gm, '');
if (paramsFromMod !== paramsOldStr) {
    console.log('List of modules and  params are different in:' + fileName);
    console.log(paramsFromMod);
    console.log(paramsOldStr);
    return;
}

//cutting define block
text = text.replace(defineRegexp, '{DEFINE}');

var lines = text.split('\n');

lines.forEach(function (line, i) {

    var found = dojoxReg.exec(line);
    if (!found) {
        out.push(line);
        return;
    }

    isFound = true;
    console.log(i, line);
    var oldModName = found[0];
    var newModName = found[3];
    var newLine = line.replace(oldModName, newModName);

    out.push(newLine);

    var depMod = '"' + oldModName.replace(/\./g, '/') + '"';
    if (dependency.indexOf(depMod) == -1) {
        dependency.push(depMod);
    }
});

if (!isFound) {
    console.log('Nothing to do here!');
    return;
}

dependency.sort();
params = modulesToParams(dependency);
//making new define
var newDefine = 'define([\n    ' + dependency.join(',\n    ') + '\n], function(\n    ' + params.join(',\n    ') + '\n) {';

//insert it
out = out.join('\n').replace('{DEFINE}', newDefine);

fs.writeFileSync(outputName, out);

//------------ fn

function modulesToParams(modulesList) {
    var params = [];
    var nicks = {
      uuid: 'uuidGen'
    };

    modulesList.forEach(function (dep) {
        var modName = dep
            .replace(/(\!.*)/g, '')           //remove !////
            .replace(/(\/\/.*)/g, '')           // remove last comments
            .replace(/[\w|_|/|.](.*)\//g, '') //remove path
            .replace(/"/g, "");                //remove "
            
        if(!modName) {
          return true;
        }

        if(nicks[modName]){
            modName = nicks[modName];
        }
        params.push(modName);
    });
    
    return params;
}
