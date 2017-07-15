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
'if (resource.download_url) { %><li><a href="<%= resource.download_url %>"><span data-toggle="tooltip" data-placement="bottom" title="<%= resource.description %>">Download</span></a>' +
'<% } else { %><li><a href="<%= resource.url %>"><span data-toggle="tooltip" data-placement="bottom" title="<%= resource.description %>">Link</span></a><% } %>' +
'&nbsp;<span class="label label-success"><%- resource.format %></span></li><% })%>' +
'<% if (ds.url) {%><li><a href="<%= ds.url %>">Landing page</a></li><% } %>' +
'</ul>' + 
'<h3>Kategorien</h3><ul>' +
'<% _.forEach(ds.groups, function(group) {%><li><%- group.display_name %></li><% })%>' +
'</ul>' +
'<h3>Nutzungsbedingungen</h3>' +
'<p><img class="terms" src="/terms_open.svg" onerror="this.onerror=null;this.src=\'/terms_open.png\'" alt="Open Data" title="Open Data"> Open Data (' +
'weitere Informationen zu den <a href="https://opendata.swiss/de/terms-of-use/">Nutzungsbedingungen<span class="glyphicon glyphicon-new-window"></span></a>)</p>' +
'</section>'
);

$.ajax({
    method: "GET",
    url: "/datasets",
}).done(function(result) {
    var parts = _.map(result.results, function(dataset) {
        console.log(dataset);
        return dataset_template({ds: dataset});
    });
    var div = $('#datasets').addClass('datasets-added');
    div.html(parts.join(''));

    // initialize the tooltips
    $('[data-toggle="tooltip"]').tooltip()
});
