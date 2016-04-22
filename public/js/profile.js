

$(document).ready(function() {

	$("span#edit_button").click(function() {
		$(this).hide();
		$("input.profile-data").prop('disabled', false);
		$("span#submit_profile_changes").show();
	});

	$("span#submit_profile_changes").click(function() {
		$(this).addClass('processing');
		$(this).text('Processing...');
		$.post('/edit_profile', {
			"name"     : $('input[name="name"]').val().trim(),
			"username" : $('input[name="username"]').val().trim(),
			"major"    : $('input[name="major"]').val().trim(),
			"bio"      : $('input[name="bio"]').val().trim()
		}, function(err, data) {
			if (err) {
				console.log(err);
				$("span#submit_profile_changes").removeClass('processing');
				$("span#submit_profile_changes").text('Submit Changes');
			} else {
				$("span#submit_profile_changes").hide();
				$("span#submit_profile_changes").removeClass('processing');
				$("span#submit_profile_changes").text('Submit Changes');
				$("input.profile-data").prop('disabled', true);
				$("span#edit_button").show();
			}
		})
	});

});