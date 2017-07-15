// Generate HTML of the widget
var dataset_template = _.template(
'<section class="well well-lg ckan-dataset">' +
'<h2><%= ds.title %>&nbsp;' +
'<small><a target="_blank" href="https://opendata.swiss/dataset/<%= ds.name %>">' +
'<span class="glyphicon glyphicon-new-window"></span>' + 
'</a></small></h2>' +
'<p><%= ds.description %></p>' +
'<div class="keywords"><% _.forEach(ds.keywords, function(keyword) {%><span class="label label-primary"><%- keyword %></span><% })%></div>' +
'<h3>Resourcen</h3><ul class="resources"> <% _.forEach(ds.resources, function(resource) { ' +
'if (resource.download_url) { %><li><a href="<%= resource.download_url %>">Download</a>&nbsp;<span data-container="body" data-toggle="popover" data-placement="bottom" data-content="<%= resource.description %>" class="glyphicon glyphicon-info-sign info-trigger" aria-hidden="true"></span>' +
'<% } else { %><li><a href="<%= resource.url %>">Link</a>&nbsp;<span data-container="body" data-toggle="popover" data-placement="bottom" data-content="<%= resource.description %>" class="glyphicon glyphicon-info-sign" aria-hidden="true"></span><% } %>' +
'&nbsp;<span class="label label-success"><%- resource.format %></span></li><% })%>' +
'<% if (ds.url) {%><li><a href="<%= ds.url %>">Landing page</a></li><% } %>' +
'</ul>' + 
'<h3>Kategorien</h3><ul>' +
'<% _.forEach(ds.groups, function(group) {%><li><%- group.display_name %></li><% })%>' +
'</ul>' +
'<h3>Nutzungsbedingungen</h3>' +
'<p><img class="terms" src="/terms_open.svg" onerror="this.onerror=null;this.src=\'/terms_open.png\'" alt="Open Data" title="Open Data"> Open Data (' +
'<a href="https://opendata.swiss/de/terms-of-use/">weitere Informationen<span class="glyphicon glyphicon-new-window"></span></a>)</p>' +
'</div>' +
'<div class="col-md-4">' +
'<table id="data-<%= ds.name %>" class="display" width="100%"></table>' +
'</div>' +
'</div>' +
'</section>'
);

var searchQuery = getParameterByName('q');

$.ajax({
    method: "GET",
    url: "/datasets?q=" + (searchQuery ? searchQuery : ''),
}).done(function(result) {
    var parts = _.map(result.results, function(dataset) {
        return dataset_template({ds: dataset});
    });
    var div = $('#datasets').addClass('datasets-added');
    div.html(parts.join(''));

    //reset search term in input field
    $('#search').val(searchQuery);

    //result count
    if (result.count === 1) {
        $('#search-result').html(result.count + ' Datensatz');
    } else {
        $('#search-result').html(result.count + ' Datensätze');
    }

    // initialize the tooltips
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
});

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

