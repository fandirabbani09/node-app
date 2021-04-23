module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPlanets(res, mysql, context, complete){
        mysql.pool.query("SELECT db_planets.id, name, population, language FROM db_planets", function (error, results, fields) {
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planets = results;
            complete();
        });
    }
    
    function getPlanet(res, mysql, context, id, complete){
        var sql = "SELECT id, name, population, language FROM db_planets WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planet = results[0];
            complete();
        });
    }
    
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteplanet.js"];
        var mysql = req.app.get('mysql');
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('planets', context);
            }

        }
    });


    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateplanet.js"];
        var mysql = req.app.get('mysql');
        getPlanet(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-planet', context);
            }

        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO db_planets (name, population, language) VALUES (?,?,?)";
        var inserts = [req.body.name, req.body.population, req.body.language];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/planets');
            }
        });
    });



    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE db_planets SET name=?, population=?, language=? WHERE id=?";
        var inserts = [req.body.name, req.body.population, req.body.language, req.params.id];
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

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM db_planets WHERE id = ?";
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