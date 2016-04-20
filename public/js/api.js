//------------------
//  USER REQUESTS
//------------------

// Create user

function create_user(data, callback) {
	$.ajax({
		method : "POST",
		url    : "/register",
		data   : {
			"name"     : data.name,
			"username" : data.username,
			"password" : data.password
		}
	}).fail(callback);
}



// Sign user in

function sign_in(data, callback) {
	$.ajax({
		method : "POST",
		url    : "/login",
		data   : {
			"username": data.username,
			"password": data.password
		}
	}).fail(callback);
}



// Log user out

function log_out() {

}



// Delete user

function delete_user() {

}





//------------------
//  MOVIE REQUESTS
//------------------