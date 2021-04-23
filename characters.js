module.exports = function(){
    var express = require('express');
    var router = express.Router();
    /*
    function getTechniques(res, mysql, context, complete) {
        mysql.pool.query("SELECT id, name FROM db_techniques", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.techniques = results;
            complete();
        });
    }
    */

    function getPlanets(res, mysql, context, complete) {
        mysql.pool.query("SELECT id, name FROM db_planets", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planets  = results;
            complete();
        });
    }

    function getCharacters(res, mysql, context, complete){
        mysql.pool.query("SELECT a.id, a.fullname, c1.name AS home, c2.name AS location, allegiance FROM db_characters as a INNER JOIN db_planets as c1 ON a.home = c1.id INNER JOIN db_planets as c2 ON a.location = c2.id ", function (error, results, fields) {
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    }

    function getCharacter(res, mysql, context, id, complete) {
        var sql = "SELECT id, fullname, home, location, allegiance FROM db_characters WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.character = results[0];
            complete();
        });
    }

    
    /* Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecharacter.js"];
        var mysql = req.app.get('mysql');
        getCharacters(res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('characters', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "selectedtechnique.js", "updatecharacter.js"];
        var mysql = req.app.get('mysql');
        getCharacter(res, mysql, context, req.params.id, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-character', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO db_characters (fullname, home, location, allegiance) VALUES (?,?,?,?)";
        var inserts = [req.body.fullname, req.body.home, req.body.location, req.body.allegiance];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/characters');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE db_characters SET fullname=?, home=?, location=?, allegiance=? WHERE id=?";
        var inserts = [req.body.fullname, req.body.home, req.body.location, req.body.allegiance, req.params.id];
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

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM db_characters WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();