

$(document).ready(function() {

	$("ul#settings_tabs > li").click(function() {
		if (!$(this).hasClass('tabs_active')) {
			$("ul#settings_tabs > li.tabs_active").removeClass('tabs_active');
			$(this).addClass('tabs_active');
			switch ($(this).text()) {
				case "General":
					$("#general_settings").show();
					$("#change_password").hide();
					$("#admin_settings").hide();
					break;

				case "Password":
					$("#general_settings").hide();
					$("#change_password").show();
					$("#admin_settings").hide();
					break;

				// case "Privacy":
				// 	$("#sign_in_form").hide();
				// 	$("#register_form").show();
				// 	break;

				case "Admin":
					$("#general_settings").hide();
					$("#change_password").hide();
					$("#admin_settings").show();
					load_users();
					break;

				default:
					break;
			}
		}
	});

	$("#settings_dropdown_form").on("input", function() {
		switch ($(this).val()) {
			case "general":
				$("#general_settings").show();
				$("#change_password").hide();
				$("#admin_settings").hide();
				break;

			case "password":
				$("#general_settings").hide();
				$("#change_password").show();
				$("#admin_settings").hide();
				break;

			// case "privacy":
			// 	$("#sign_in_form").hide();
			// 	$("#register_form").show();
			// 	break;

			case "admin":
				$("#general_settings").hide();
				$("#change_password").hide();
				$("#admin_settings").show();
				load_users();
				break;

			default:
				break;
		}
	});

	$("div#user_list").on("click", "span.admin-action", function() {
		var userID = $(this).closest("div.user-block").attr("id");
		switch ($(this).text()) {
			case "Ban User":
				$.post('/ban_user', {id: userID}, function(err) {
					if (err) {
						console.log(err);
					}
				});
				$(this).text("Unlock User");
				break;

			case "Unlock User":
				$.post('/unlock_user', {id: userID}, function(err) {
					if (err) {
						console.log(err);
					}
				});
				$(this).text("Ban User");
				break;
		}
	});

});

function load_users() {
	$.get('/users', function(users) {
		var content = "";
		for (var i = 0; i < users.length; i++) {
			content += '<div id="' + users[i].id + '" class="user-block"><span class="user-block-name">';
			content += users[i].name;
			content += '</span><span class="button-red admin-action">';
			content = users[i].userStatus == 'active' ? content + 'Ban User' : content + 'Unlock User';
			content += '</span></div>';
		}
		$("#user_list").html(content);
	})
}