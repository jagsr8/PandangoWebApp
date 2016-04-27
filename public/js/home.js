

$(document).ready(function() {

	$("#search_bar").on('input', function() {
		switch($("select#search_type").val()) {
			case "movies":
				$.ajax({
					url      : 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=yedukp76ffytfuy24zsqk7f5&q=' + encodeURI($(this).val()),
					dataType : "jsonp",
					success  : displayResults
				});
				break;
			case "new releases":
				$.ajax({
					url      : 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?apikey=yedukp76ffytfuy24zsqk7f5&q=' + encodeURI($(this).val()),
					dataType : "jsonp",
					success  : displayResults
				});
				break;
			case "new DVDs":
				$.ajax({
					url      : 'http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/new_releases.json?apikey=yedukp76ffytfuy24zsqk7f5&q=' + encodeURI($(this).val()),
					dataType : "jsonp",
					success  : displayResults
				});
				break;
		}
		if ($(this).val() == "") {
			$("div#search_results").html("");
			$("section#top_charts").show();
		}
	});

});

function displayResults(data) {
	var movies = data.movies;
	console.log(movies);
	var content = "";
	for (var i = 0; i < movies.length; i++) {
		var movie = movies[i];
		content += '<div class="result-block">';
		content += '<img src="' + movie.posters.profile + '" />';
		content += '<h2>' + movie.title + '</h2>';
		content += '<span class="movie-meta">Year: ' + movie.year + '</span>';
		content += '<span class="movie-meta">MPAA Rating: ' + movie.mpaa_rating + '</span>';
		content += '<span class="movie-meta">Runtime: ' + movie.runtime + ' min</span>';
		content += '<p>' + movie.synopsis + '</p>';
		content += '<a href="/movie/' + movie.id + '"><button class="button-red">More Details</button></a>';
		content += '</div>';
	}
	$("section#top_charts").hide();
	$("div#search_results").html(content);
}