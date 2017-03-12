var apiKey = 'AIzaSyAdJU2lCm1APgPFpzjHEGb_1i9Xj-rMBOM';
var googleTranslate = require('google-translate')(apiKey);

var http = require('http');

function translate(word, lang) {
    googleTranslate.translate(
        word, lang, 
        function(err, translation) {
            if (err) {
                console.log('error: ' + err);
            }
            console.log(translation.translatedText);
        }
    );
}
var request = require('request');
var cheerio = require('cheerio');

function test() {
    url = 'https://translate.google.com/#auto/es/cold';
    options = {
          url: url,
          headers: {
            'User-Agent':"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30)"       
          }

    };

    request(options, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            console.log(response);
            var $ = cheerio.load(html);
            var source = $('#source');
        } else {
            console.log(error);
        }
    });
}


var options = {
    url: 'https://translate.google.com/#auto/es/cold',
    headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:13.0) Gecko/20100101 Firefox/13.0'            
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
            console.log(body); 
    }

}

request(options, callback);

var readLine = require('readline'),
    fs = require('fs');

var words = 'words.in';

var lineReader = readLine.createInterface({
      input: fs.createReadStream(words)
});
//lineReader.on('line', function (word) {
//    console.log(word);
//    translate(word, 'es');
//});
