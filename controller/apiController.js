const request = require('request-promise');
const utils = require('../utils/utils');
const Memcached = require('memcached');
var memcached = new Memcached();

memcached.connect( '127.0.0.1:11211', function( err, conn ){
    if( err ) {
       console.log(err);
    }
  });

exports.getData = (req, res, next) => {
    const country = req.body.country;
    const category = req.body.category;
    const keys = req.body.keys;
    var main_url = utils.base_url;
    var url = "";
    const params = [];
    if(country) {
        url += `&country=${country}`;
        params.push(country);
    } 
    if(category) {
        params.push(category);
        url += `&category=${category}`;
    }

    if(keys) {
        params.push(keys);
        url += `&q=${keys}`;
    }
    if(!keys && !category && !country) {
        return res
            .status(204)
            .render('index', {data: [], params: params, ers: "Please enter valid Parameters"})
    }
    main_url += url;
    memcached.gets(main_url, (err, data) => {
        if(!data) {
            request(main_url)
                .then(reslt => {
                    const result = JSON.parse(reslt);
                    if(result.articles && result.articles.length ) {
                        memcached.add(main_url, result, 600, (err) => {
                            return res
                                .status(200)
                                .render('index', {data: result.articles, params: params, ers:""});
                        })
                    } else {
                        return res
                            .status(200)
                            .render('index', {data: [], params: params, ers: "No Data found, please try with diffferent keyword"});
                    }
                })
                .catch(err => {
                    return res
                    .status(200)
                    .render('index', {data: [], params: params, ers: "Error Occured in fetching data, please try after sometimes."});
                })
        } else {
            if(data[main_url].articles && data[main_url].articles.length) {
                return res
                    .status(200)
                    .render('index', {data: data[main_url].articles, params: params, ers:""});
            } else {
                return res
                            .status(200)
                            .render('index', {data: [], params: params, ers: "No Data found, please try with diffferent keyword"});
            }
        }
    })       
}

