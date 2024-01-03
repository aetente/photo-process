
var path = require('path');    

var expres = require('express');

var ehpp = expres();

var theFile = path.join(__dirname, '/index.html');

ehpp.use(expres.static(__dirname));

ehpp.get('/',function(req,res){
        res.sendFile(theFile);
    });
ehpp.listen(8080);

console.log('Port 8080 is my city');