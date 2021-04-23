module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getDragonballs(res, mysql, context, complete) {
        mysql.pool.query("SELECT A.id, C1.fullname AS possessor, C2.name AS location FROM db_dragonballs AS A INNER JOIN db_characters AS C1 ON A.possessor = C1.id INNER JOIN db_planets AS C2 ON A.location = C2.id ORDER BY A.id ASC", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.dragonballs = results;
            complete();
        });
    }
 
    function getPlanets(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM db_planets", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planets  = results;
            complete();
        });
    }
    
    function getPeople(res, mysql, context, complete) {
        mysql.pool.query("SELECT db_characters.id, fullname FROM db_characters", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    function getDragonball(res, mysql, context, id, complete){
        var sql = "SELECT id, possessor, location FROM db_dragonballs WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.dragonball = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //context.jsscripts = ["deleteperson.js"];
        var mysql = req.app.get('mysql');
        getDragonballs(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('dragonballs', context);
            }

        }
    });

    /* Returns a single dragonball record for the update page */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedperson.js", "selectedplanet.js", "updatedragonball.js"];
        var mysql = req.app.get('mysql');
        getDragonball(res, mysql, context, req.params.id, complete);
        getPeople(res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-dragonball', context);
            }

        }
    });

    /* Updates a dragonball record */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE db_dragonballs SET possessor=?, location=? WHERE id=?";
        var inserts = [req.body.possessor, req.body.location, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    return router;
}();