module.exports = function(){
    var express = require('express');
    var router = express.Router();

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

    function getAllCharacterTechniques(res, mysql, context, complete) {
        mysql.pool.query("SELECT T.name, C.fullname FROM db_techniques as T INNER JOIN db_character_techniques as CT ON CT.technique = T.id INNER JOIN db_characters as C ON CT.master = C.id", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.character_techniques = results;
            complete();
        });
    }

    function getCharacters(res, mysql, context, complete){
        mysql.pool.query("SELECT id, fullname FROM db_characters", function (error, results, fields) {
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    }

    function getCharacter(res, mysql, context, id, complete) {
        var sql = "SELECT id, fullname, home, location, technique, allegiance FROM db_characters WHERE id = ?";
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

    /* Gets all techinques that is mastered by the input user id */

    function getCharacterTechniques(res, mysql, context, id, complete) {
        var sql = "SELECT T.name, C.fullname FROM db_techniques as T INNER JOIN db_character_techniques as CT ON CT.technique = T.id INNER JOIN db_characters as C ON CT.master = C.id WHERE C.id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.techniques = results;
            complete();
        });
    }
    
    /* Display all character techniques. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecharactertechnique.js"];
        var mysql = req.app.get('mysql');
        getAllCharacterTechniques(res, mysql, context, complete);
        getCharacters(res, mysql, context, complete);
        getTechniques(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('character_techniques', context);
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
        getTechniques(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('character_techniques', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO db_character_techniques (master, technique) VALUES (?,?)";
        var inserts = [req.body.master, req.body.technique];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/character_techniques');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE db_charactertechniques SET master=?, technique=? WHERE id=?";
        var inserts = [req.body.master, req.body.technique, req.params.id];
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
        var sql = "DELETE FROM db_character_techniques WHERE id = ?";
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