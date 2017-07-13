var ckan = require('ckan');
var _ = require('lodash');

exports.query = query;

var LANGS = ['de', 'en', 'fr', 'it'];

var datasets;

function query(query, lang, callback) {
    if (datasets) {
        callback(null, datasets);
        return;
    }
    var client = new ckan.Client('https://opendata.swiss');
    client.action(
        'package_search',
        {
            q: query,
            rows: 100
        },
        function(err, res) {
            if (err) {
                callback(err);
                return;
            }
            datasets = res.result;
            // convert multilingual result to monolingual result
            if (!_.isEmpty(datasets.results) && _.includes(LANGS, lang)) {
                datasets.results = _.map(datasets.results, function(dataset) {
                    dataset.keywords = getLangValue(dataset.keywords, lang);
                    dataset.display_name = getLangValue(dataset.display_name, lang);
                    dataset.title = getLangValue(dataset.title, lang);
                    dataset.description = getLangValue(dataset.description, lang);

                    dataset.organization.display_name = getLangValue(dataset.organization.display_name, lang);
                    dataset.organization.description = getLangValue(dataset.organization.description, lang);
                    dataset.organization.title = getLangValue(dataset.organization.title, lang);

                    dataset.resources = _.map(dataset.resources, function(resource) {
                        resource.title = getLangValue(resource.title, lang);
                        resource.display_name = getLangValue(resource.display_name, lang);
                        resource.name = getLangValue(resource.name, lang);
                        resource.description = getLangValue(resource.description, lang);
                        return resource;
                    });

                    dataset.groups = _.map(dataset.groups, function(group) {
                        group.display_name = getLangValue(group.display_name, lang);
                        group.description = getLangValue(group.description, lang);
                        return group;
                    });

                    return dataset;
                });
            }
            callback(null, datasets);
        }
    );
}

function getLangValue(obj, lang) {
    if (_.has(obj, lang) && obj[lang]) {
        return obj[lang];
    }
    var altLang = _.find(LANGS, function(curLang) {
        return (_.has(obj, curLang) && obj[curLang]);
    });
    if (altLang) {
        return obj[altLang];
    }
    if (_.every(LANGS, function(curLang) { return _.has(obj, curLang); })) {
        return obj[lang];
    }
    return obj;
}

