var express = require('express');
var datasets = require('./datasets');

var app = express();

app.use(express.static('public'));

app.get('/datasets', function(req, res) {
    var q = req.query.q ? req.query.q : '';
    var fq  = 'organization:("kanton-basel-stadt" OR "statistisches-amt-kanton-basel-stadt")';

    datasets.query(q, fq, 'de', function(err, result) {
        if (err) {
            res.status(500).send('Error occured when querying for datasets: ' + err);
            return;
        }
        res.json(result);
    });
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log('Portal showcase app listening on port ' + port);
})
