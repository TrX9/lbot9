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
      var opts = {
      maxResults: 1,
      key: 'AIzaSyAtFX5BwBuUE-xh0HBIHiDwb24lzBjqQQU'
    };
    let srchRes = 'test';
 
search(txt1, opts, function(err, results) {
  //var data1 = JSON.parse(results);
  //srchRes = data1.link;
  for (const result of results) {
    console.dir(`the link : ${result.link}`)
    srchRes=result.link;
    console.dir(srchRes);
    return res.json({
      speech: srchRes,
      displayText: 'Something went wrong!',
      source: 'team info'
  });
}
  if(err) return console.log(err);
  //console.dir(results);
});     
  //    return res.json({
  //      speech: 'Something went wrong!'+srchRes,
  //      displayText: 'Something went wrong!',
  //      source: 'team info'
  //  });

    }



    function getTeamInfo(req,res)
{
let teamToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.team ? req.body.result.parameters.team : 'Unknown';
TeamInfo.findOne({name:teamToSearch},function(err,teamExists)
      {
        if (err)
        {
          return res.json({
              speech: 'Something went wrong!',
              displayText: 'Something went wrong!',
              source: 'team info'
          });
        }
if (teamExists)
        {
          return res.json({
                speech: teamExists.description,
                displayText: teamExists.description,
                source: 'team info'
            });
        }
        else {
          return res.json({
                speech: 'Currently I am not having information about this team',
                displayText: 'Currently I am not having information about this team',
                source: 'team info'
            });
        }
      });
}

function getTeamSchedule(req,res)
{
let parameters = req.body.result.parameters;
    if (parameters.team1 == "")
    {
      let game_occurence = parameters.game_occurence;
      let team = parameters.team;
      if (game_occurence == "previous")
      {
        //previous game
        GameSchedule.find({opponent:team},function(err,games)
        {
          if (err)
          {
            return res.json({
                speech: 'Something went wrong!',
                displayText: 'Something went wrong!',
                source: 'game schedule'
            });
          }
          if (games)
          {
            var requiredGame;
            for (var i=0; i < games.length; i++)
            {
                var game = games[i];
                var convertedCurrentDate = new Date();
                var convertedGameDate = new Date(game.date);
                if (convertedGameDate > convertedCurrentDate)
                {
                  if(games.length > 1)
                  {
                    requiredGame = games[i-1];
                    var winningStatement = "";
                    if (requiredGame.isWinner)
                    {
                        winningStatement = "Kings won this match by "+requiredGame.score;
                    }
                    else {
                      winningStatement = "Kings lost this match by "+requiredGame.score;
                    }
                    return res.json({
                        speech: 'Last game between Kings and '+parameters.team+' was played on '+requiredGame.date+' .'+winningStatement,
                        displayText: 'Last game between Kings and '+parameters.team+' was played on '+requiredGame.date+' .'+winningStatement,
                        source: 'game schedule'
                    });
                    break;
                  }
                  else {
                    return res.json({
                        speech: 'Cant find any previous game played between Kings and '+parameters.team,
                        displayText: 'Cant find any previous game played between Kings and '+parameters.team,
                        source: 'game schedule'
                    });
                  }
                }
            }
}
});
      }
      else {
        var telID = req.body.originalRequest.data.message.chat.id;
        return res.json({
            speech: 'Next game schedules will be available soon'+telID,
            displayText: 'Next game schedules will be available soon',
            source: 'game schedule'
        });
      }
    }
    else {
      return res.json({
          speech: 'Cant handle the queries with two teams now. I will update myself',
          displayText: 'Cant handle the queries with two teams now. I will update myself',
          source: 'game schedule'
      });
    }
  }