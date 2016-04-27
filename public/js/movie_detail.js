

$(document).ready(function() {

	$("span#rate_button").click(function() {
		switch ($(this).text()) {
			case "Rate":
				$("input#new_rating").show();
				$(this).text("Submit");
				break;

			case "Submit":
				submit_rating($("inpu#new_rating").val())
				$("input#new_rating").hide();
				$(this).text("Rate");
				break;
		}
	})

});

function submit_rating(rating) {
	$.post('/submit_rating', {
		"moviename" : $("h1#movie_name").text(),
		"rating"    : rating
	}, function(err) {
		if (err) {
			console.log(err);
		} else {
			$.get('/get_rating', {
				"moviename" : $("h1#movie_name").text()
			}, function(avg_rating) {
				$.post('/update_average', {
					"moviename"  : $("h1#movie_name").text(),
					"rating"     : rating,
					"numOfRates" : avg_rating.num_of_ratings
				}, function(err2) {
					if (err2) {
						console.log(err2);
					}
				});
			});			
		}
	});
}