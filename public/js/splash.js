var isUsernameAvailable = false;

$(document).ready(function() {

	$("ul#login_tabs > li").click(function() {
		if (!$(this).hasClass('tabs_active')) {
			$("ul#login_tabs > li.tabs_active").removeClass('tabs_active');
			$(this).addClass('tabs_active');
			switch ($(this).text()) {
				case "Sign In":
					$("#register_form").hide();
					$("#sign_in_form").show();
					break;

				case "Register":
					$("#sign_in_form").hide();
					$("#register_form").show();
					break;

				default:
					break;
			}
		}
	});

});

function process_sign_in() {
	if ($("form#sign_in_form span.submit").hasClass('processing')) {return;}

	clear_all_notices();
	$("form#sign_in_form span.submit").text('Processing...');
	$("form#sign_in_form span.submit").addClass('processing');

	if ($("form#sign_in_form input[name='username']").val() == "") {
		$("#sign_in_error").show();
		restore_button_sign_in();
	} else {
		if ($("form#sign_in_form input[name='password']").val() == "") {
			$("#sign_in_error").show();
			restore_button_sign_in();
		} else {

			// post request
			// sign_in({
			// 	'username' : $("form#sign_in_form input[name='username']").val(),
			// 	'password' : $("form#sign_in_form input[name='password']").val()
			// }, function() {
			// 	$("form#sign_in_form #sign_in_error").show();
			// 	restore_button_sign_in();
			// })

		}
	}
}



function process_register() {
	var username = /^[a-zA-Z0-9_-]{4,10}$/;
	var password = /^[a-zA-Z0-9]{6,16}$/;

	if ($("form#register_form span.submit").hasClass('processing')) {return;}

	clear_all_notices();
	$("form#register_form span.submit").text('Processing...');
	$("form#register_form span.submit").addClass('processing');

	// Begin validation
	if ($("form#register_form input[name='first_name']").val() == "") {
		$("form#register_form #register_error_fname").show();
		$("form#register_form input[name='first_name']").addClass('input-error');
		restore_button_register();
	} else {
		if ($("form#register_form input[name='last_name']").val() == "") {
			$("form#register_form #register_error_lname").show();
			$("form#register_form input[name='last_name']").addClass('input-error');
			restore_button_register();
		} else {
			if (!username.test($("form#register_form input[name='username']").val())) {
				$("form#register_form #register_error_uname").show();
				$("form#register_form input[name='username']").addClass('input-error');
				restore_button_register();
			} else {
				if (isUsernameAvailable) {
					$("form#register_form #register_error_uname_avl").show();
					$("form#register_form input[name='username']").addClass('input-error');
					restore_button_register();
				} else {
					if (!password.test($("form#register_form input[name='password']").val())) {
						$("form#register_form #register_error_pass").show();
						$("form#register_form input[name='password']").addClass('input-error');
						restore_button_register();
					} else {
						if ($("form#register_form input[name='password']").val() !== $("form#register_form input[name='password_confirm']").val()) {
							$("form#register_form #register_error_pass_confirm").show();
							$("form#register_form input[name='password_confirm']").addClass('input-error');
							restore_button_register();
						} else {

							// post request
							// create_user({
							// 	'name'     : $("form#register_form input[name='first_name']").val() + " " + $("form#register_form input[name='last_name']").val(),
							// 	'username' : $("form#register_form input[name='username']").val(),
							// 	'password' : $("form#register_form input[name='password']").val()
							// }, function() {
							// 	$("form#register_form #register_error").show();
							// 	restore_button_register();
							// })

						}
					}
				}
			}
		}
	}
}

function restore_button_sign_in() {
	$("form#sign_in_form span.submit").text('Sign In');
	$("form#sign_in_form span.submit").removeClass('processing');
}

function restore_button_register() {
	$("form#register_form span.submit").text('Register');
	$("form#register_form span.submit").removeClass('processing');
}

function clear_all_notices() {
	$("p.form-detail, p.form-error").hide();
	$("input.input-error").removeClass('input-error');
}