//get parameters
var searchQuery = getParameterByName('q');
var tag = getParameterByName('tag');
var simple = getParameterByName('simple');

// Generate HTML of the widget
var dataset_template = _.template(
'<section class="well well-lg ckan-dataset">' +
'<h2><%= ds.title %>&nbsp;' +
'<small><a target="_blank" href="https://opendata.swiss/dataset/<%= ds.name %>">' +
'<span class="glyphicon glyphicon-new-window"></span>' + 
'</a></small></h2>' +
'<p><%= ds.description %></p>' +
'<div class="keywords"><% _.forEach(ds.keywords, function(keyword) {%><a href="/?tag=<%= keyword %>"><span class="label label-primary"><%- keyword %></span></a> <% })%></div>' +
'<div class="row">' +
'<div class="col-md-6">' +
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
'<div class="col-md-6">' +
'<% if (ds.url.startsWith("https://statabs.github.io") && !simple) {%> <div class="intrinsic-container intrinsic-container-4x3"><iframe frameborder="0" src="<%= ds.url %>" class="preview-iframe"></iframe></div> <% } %>' +
'</div>' +
'</div>' +
'</section>'
);


$.ajax({
    method: "GET",
    url: "/datasets?q=" + (searchQuery ? searchQuery : '') + '&tag=' + (tag ? tag : ''),
}).done(function(result) {
    var parts = _.map(result.results, function(dataset) {
        return dataset_template({ds: dataset});
    });
    var div = $('#datasets').addClass('datasets-added');
    div.html(parts.join(''));

    //reset search term in input field
    $('#search').val(searchQuery);

    //set tag
    if (tag) {
        $('#tag-filter').html('<a href="/" title="Schlagwort-Filter entfernen"><span class="label label-primary">' + tag + ' <span class="glyphicon glyphicon-remove"></span></span></a>');
    }

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

