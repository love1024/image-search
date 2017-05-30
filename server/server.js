import express from 'express';
import imgSearch from '../routes/img-search';
import mongodb from 'mongodb';

var app = express();
var mongoClient = mongodb.MongoClient;
var mongourl = "mongodb://love1024:Lsvwsan9@ds029496.mlab.com:29496/img-search";

mongoClient.connect(mongourl,function(err,db) {
    if(err) throw err;
    app.use(express.static(__dirname+'/../src'));
    imgSearch(app,db);
});

const port = 2500;
app.listen(process.env.PORT || port);

