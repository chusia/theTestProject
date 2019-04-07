'use strict'

var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var supertest = require('supertest');
var puppeteer = require('puppeteer');
<<<<<<< HEAD
var fs = require('fs');
var progress = require('request-progress');
=======
>>>>>>> debb1918c8c68f45069f13de82997080ff1452d7

/* GET html page. */
router.get('/getHtml/:name', function (req, res, next) {
    var htmlName = req.params.name;
    console.log(htmlName)
    res.sendfile('views/' + htmlName + '.html');
});


router.get("/weather/:area", function (req, res, next) {
    var areaList = {
        "100": "中正區",
        "115": "南港區",
        "111": "士林區",
        "112": "北投區",
        "104": "中山區",
        "114": "內湖區",
        "103": "大同區",
        "110": "信義區",
        "105": "松山區",
        "106": "大安區",
        "108": "萬華區",
        "116": "文山區"
    }
    if (areaList[req.params.area] != undefined) {
        var area = areaList[req.params.area];
    }
    supertest('https://opendata.cwb.gov.tw')
        .get('/api/v1/rest/datastore/F-D0047-063?Authorization=CWB-202DC472-3538-482D-A144-FD54F93DE9C5')
        .set('Accept', 'application/json')
        .end(function (err, response) {
            if (err != null) {
                console.log(err);
                res.json('error');
            } else {
                try {
                    console.log(response.body)
                    var result = response.body;
                    if (!result.success) {
                        console.log('error');
                        res.json('error');
                    } else {
                        var tmp = {};
                        var list = ['MinT', 'MaxT', 'Wx', 'T', 'PoP12h'];
                        for (var i = 0; i < result.records.locations[0].location.length; i++) {
                            var data = result.records.locations[0].location[i];
                            if (data.locationName == area) {
                                tmp.lat = data.lat;
                                tmp.lon = data.lon;
                                tmp.locationName = data.locationName;
                                for (var j = 0; j < data.weatherElement.length; j++) {
                                    var tooLong = data.weatherElement[j];
                                    if (list.indexOf(tooLong.elementName) != -1) {
                                        let array = [];
                                        tooLong.time.forEach(element => {
                                            array.push(element.elementValue[0].value);
                                        });
                                        let json = {};
                                        json.measures = tooLong.time[0].elementValue[0].measures;
                                        json.data = array;
                                        tmp[tooLong.elementName] = json;
                                    }
                                }
                                break;
                            }
                        }
                        res.json(tmp);
                    }
                } catch (error) {
                    console.log(error)
                    res.json(error)
                }
            }
        })
});
router.get("/news", function (req, res, next) {
    var browser;
    var page;
    var resultArray = [];
    var tArray = [];
    var url = "https://news.google.com/?hl=zh-TW&gl=TW&ceid=TW:zh-Hant";
    var article;
    async.series([
        function (next) {
            puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
                .then(brw => {
                    browser = brw;
                    next();
                }).catch(err => {
                    console.log(err)
                });
        },
        function (next) {
            browser.newPage()
                .then(pag => {
                    page = pag;
                    next();
                }).catch(err => {
                    console.log(err)
                });
        },
        function (next) {
            page.goto(url)
                .then(pag => {
                    next();
                }).catch(err => {
                    console.log(err)
                });
        },
        function (next) {
            page.waitFor(".dSva6b")
                .then(pag => {
                    next();
                }).catch(err => {
                    console.log(err)
                });
        },
        function (next) {
            request.get({
                url: url,
            }, function (err, response, body) {

                if (body != undefined) {
                    //main c-wiz .lBwEZb.BL5WZb.xP6mwf
                    var strTmp = body.split('<c-wiz')
                    var str = strTmp[3].split('</c-wiz>')
                    var res = str[0].match(/jscontroller\=\"d0DtYd\"/g);
                    console.log(str[0].match(/div\sclass\=\"dSva6b/g));
                    article = 35;
                    console.log(article);
                    for (var i = 0; i < article; i++) {
                        var tmp = {}
                        tmp.no = (i + 1).toString();
                        tArray.push(tmp);
                    }
                    next();
                } else {
                    console.log("no body")
                }
            })
        },
        function (next) {
            //for(var i = 0; i < )
            let requests = tArray.map((ele) => {
                return new Promise((resolve, reject) => {
                    getArticle(ele, page, resultArray, resolve, reject);
                });
            });
            Promise.all(requests).then(value => {
                console.log(resultArray);
                next();
            }, resion => {
                res.json('err')
            });
        },
        function (next) {
            browser.close()
                .then(pag => {
                    res.json(resultArray);
                }).catch(err => {
                    console.log(err)
                });
        },
    ])
})

function getArticle(ele, page, resultArray, resolve, reject) {
    //.innerText  .length  .herf
    /*
    page.$eval("main c-wiz .lBwEZb.BL5WZb.xP6mwf div:nth-child(" + ele.no + ")", e => e.length)
    .then(text => {
        console.log(ele.no + ")" + text);
        ele.title = text;
        resolve();
    }).catch(err => {
        console.log(err);
        reject();
    });
    */
    page.$eval("main c-wiz .lBwEZb.BL5WZb.xP6mwf div:nth-child(" + ele.no + ")", e => e.innerText)
        .then(text => {
            var art = text.match(/more_vert/g)

            if (art != null) {
                var a = text.split("\n")

                if (a.length < 9) {
                    console.log('1')
                } else if(a.length == 9) {
                    console.log('2')
                    var tmp = {};
                    tmp.title = a[0];
                    tmp.content = a[2];
                    resultArray.push(tmp);
                } else {
                    console.log('3')
                    var tmp = {};
                    tmp.title = a[0];
                    tmp.content = a[2];
                    resultArray.push(tmp);
                    
                    var indexes = [];
                    var i = -1;
                    while ((i = a.indexOf("more_vert", i+1)) != -1){
                        indexes.push(i);
                    }
                    var time = indexes.length
                    for(var i = 0; i < time - 1; i++) {
                        var tmp = {};
                        tmp.title = a[indexes[i] + 1];
                        tmp.content = a[indexes[i] + 3]
                        resultArray.push(tmp);
                    }
                }
            }
            resolve();
        }).catch(err => {
            console.log(err);
            reject();
        });
}
<<<<<<< HEAD
router.get("/download", function (req, res, next) {
    console.log(new Date())
    var fs = require('fs');
var request = require('request');
var progress = require('request-progress');
 
// The options argument is optional so you can omit it
progress(request('https://nofile.io/g/CgYScrFXNmwRbFKEc5kvMOq7h36kDMzIyLzh1xl4OIUjp5eH5KGy0CyVUhewtUGN/Music.rar/'), {
    // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
    // delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
    // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
})
.on('progress', function (state) {
    // The state is an object that looks like this:
    // {
    //     percent: 0.5,               // Overall percent (between 0 to 1)
    //     speed: 554732,              // The download speed in bytes/sec
    //     size: {
    //         total: 90044871,        // The total payload size in bytes
    //         transferred: 27610959   // The transferred payload size in bytes
    //     },
    //     time: {
    //         elapsed: 36.235,        // The total elapsed seconds since the start (3 decimals)
    //         remaining: 81.403       // The remaining seconds to finish (3 decimals)
    //     }
    // }
    console.log(new Date(), state);
})
.on('error', function (err) {
    console.log(err)
    // Do something with err
})
.on('end', function () {
    console.log("end")
    // Do something after request finishes
})
.pipe(res);
})

=======
>>>>>>> debb1918c8c68f45069f13de82997080ff1452d7
module.exports = router;
