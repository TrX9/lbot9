'use strict';
var mongoose = require('mongoose');
var search = require('youtube-search');
var TeamInfo = mongoose.model('TeamInfo');
var GameSchedule = mongoose.model('GameSchedule');

exports.processRequest = function(req, res) {
    if (req.body.result.action == "schedule") {
        getTeamSchedule(req,res)
      }
      else if (req.body.result.action == "tell.about")
      {
          getTeamInfo(req,res)
      }
      else if (req.body.result.action == "ytube")
      {
          getVideo(req,res)
      }
    };

    function getVideo(req,res)
    {
      
      let txt1 = req.body.result.resolvedQuery;
      var res1 = txt1.substring(3);
      var opts = {
      maxResults: 1,
      key: 'AIzaSyAtFX5BwBuUE-xh0HBIHiDwb24lzBjqQQU'
    };
    let srchRes = 'test';

 
search(res1, opts, function(err, results) {
  for (const result of results) {
    console.dir(`the link : ${result.link}`)
    srchRes=result.link;
    //console.dir(srchRes);
    return res.json({
      speech: srchRes,
      displayText: 'Something went wrong!',
      source: 'team info'
  });
}
  if(err) return console.log(err);
  //console.dir(results);
});     
    }
