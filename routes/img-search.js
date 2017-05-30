import request from 'request';

module.exports = function(app,db) {

    app.route("/history")
        .get(getHistory)

    app.route("/api/:search")
        .get(handleRequest)

    function handleRequest(req,res) {
        let search = req.params.search;
        let offset = req.query.offset || 10;

        if(search != 'favicon.ico')
            saveHistory(search,new Date().toLocaleString());

        request("https://www.googleapis.com/customsearch/v1?key=AIzaSyDMwThXYxVMc_L61gQnKA2tVPGEqwF0CWk"+
                    "&cx=007041012867111871347:5iejxlk-sdk&searchType=image&q="+search+"&start="+offset,
        function(err,response,body) {
            if(err) throw err;

            var arr = JSON.parse(body).items;
            arr = arr.map(makeData);
            res.setHeader("Content-type","application/json");
            res.json(arr);
        });
    }

    function makeData(img) {
        return {
            "url":img.link,
            "snippet":img.snippet,
            "thumbnail":img.image.thumbnailLink,
            "context":img.displayLink
        }
    }

    function saveHistory(term,when) {
        var collection = db.collection("imgSearch");
        collection.insert({
            term:term,
            when:when
        },function(err){
            if(err) throw err;
        });
    }

    function getHistory(req,res) {
        var collection = db.collection("imgSearch");
        collection.find({},{
            limit:10,
            fields:{
                _id:0
            }
        }).toArray(function(err,collection){
            if(err) throw err;
            res.send(collection);
        });
    }
}
