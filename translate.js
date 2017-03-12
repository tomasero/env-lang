#!/usr/bin/env phantomjs

var system = require('system');
var params = system.stdin.read().split(',');
var text = params[0];
var sourceLang = "en";
var targetLang = params[1].replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,"");
//var url = "https://translate.google.com/#"+sourceLang+"/"+targetLang;
var url = "https://translate.google.com/#auto/"+targetLang+"/"+text;
//https://translate.google.com/#auto/es/snow

var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:13.0) Gecko/20100101 Firefox/13.0';

page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }
    // uncomment to log into the console 

    // console.error(msgStack.join('\n'));
};

page.onConsoleMessage = function (msg) {
    if ( msg == "phanthom.exit()"  ) {
        phantom.exit();

    } else {
        system.stdout.write(msg);
        system.stdout.flush();

    }
    page.render("test.png");
};

/*
 * This function wraps WebPage.evaluate, and offers the possibility to pass
 * parameters into the webpage function. The PhantomJS issue is here:
 * 
 *   http://code.google.com/p/phantomjs/issues/detail?id=132
 * 
 * This is from comment #43.
 */
function evaluate(page, func) {
    var args = [].slice.call(arguments, 2);
    var fn = "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify(args) + "); }";
   return page.evaluate(fn);

}

page.open(url, function (status) {
    if (status !== 'success') {
        console.log('Unable to access network');
    } else {
        page.injectJs('jquery.js');
        var result = evaluate(page, function(text){
            var getResult=function(){
                //var result_box=document.querySelector(".gt-baf-table");
                //console.log(result_box.outerHTML);
                var res = $('.gt-baf-table');
                var row = [];
    
                $(".gt-baf-pos-head, .gt-baf-word-clickable").each(function() {
                    row.push($(this).text());
                });
                if (row.length == 0) {
                  row.push($('#result_box').text());
                }
                console.log(row);
            }
            getResult();

        }, text );
    }
    phantom.exit();
});
