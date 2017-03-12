var exec = require('child_process').exec;
var word = process.argv[2];
var command = 'echo "' + word + ',{0}" | phantomjs translate.js';
var langCounts = {};
var testLang = "Russian";
var debug = false;

String.prototype.format = function(){
      var args = arguments;
      return this.replace(/\{(\d+)\}/g, function(a, num){
              return args[num] || a
      })
}

function execute(command, callback){
    exec(command, function(error, stdout, stderr) { 
        callback(stdout);  
    });
};

var types = ['adjective', 'noun', 'adverb'];

function isInTypes(elem) {
    return types.indexOf(elem) < 0;
}

function sortNumber(a,b) {
    return a - b;
}

function processLang (langName, langCode, numLangs) {
    langCommand = command.format(langCode);
    execute(langCommand, function(output) {
        var words = output.split(',');
        if (debug && langName == testLang) {
            console.log(words);
        }
        var idx = [];
        types.forEach(function (elem) {
            pos = words.indexOf(elem);
            if (pos != -1) {
                idx.push(pos);
            }
        })
        idx.sort(sortNumber);
        if (debug && langName == testLang) {
            console.log(idx);
        }
        translations = {};
        if (idx.length == 0) {
            _translations = words.slice(1, words.length);  
            if (_translations.length == 0) {
                translations['undefined'] = words;        
            } else {
                translations['undefined'] = _translations; 
            }
        } else {
            for (var i = 0; i < idx.length; i++) {
                start = idx[i] + 1;
                end = idx[i + 1 || idx.length];
                translations[types[i]] = words.slice(start, end);
                if (debug && langName == testLang) {
                    console.log("start: " + start);
                    console.log("end: " + end);
                }
            }
        }
        if (debug && langName == testLang) {
            console.log(translations);
        }
        //console.log(translations);
        langCounts[langName] = {};
        var total = 0;
        for (var key in translations) {
            num = translations[key].length;  
            langCounts[langName][key] = num;
            total += num;
        }
        langCounts[langName]['total'] = total;
        if (Object.keys(langCounts).length == numLangs) {
            console.log(langCounts);
            printSorted(langCounts);
        }
    });
}


function printSorted(langCounts) {
    var sortable = [];
    for (var lang in langCounts) {
        sortable.push([lang, langCounts[lang]['total']]);
    }
    
    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });
    console.log(sortable);
}

langsFile = './langs.csv';
var fs = require('fs'); 
var parse = require('csv-parse');

function getLangs(func) {
    var csvData=[];
    fs.createReadStream(langsFile)
        .pipe(parse({delimiter: ','}))
        .on('data', function(csvrow) {
            csvData.push(csvrow);        
        })
        .on('end',function() {
              //do something wiht csvData
            func(csvData);
        });
}

getLangs(function(langs) {
    for (var i = 0; i < langs.length; i++) {
        var lang = langs[i];
        if (debug && lang[0] != testLang) {
            continue;
        }
        processLang(lang[0], lang[1], langs.length);
    }
})

//var express = require('express')
//var app = express()
//app.use(express.static(__dirname + '/')); 
//
//    app.get('/', function (req, res) {
//          //res.sendFile('./index.html');
//    })
//
//app.listen(3000, function () {
//      console.log('Example app listening on port 3000!')
//
//})
