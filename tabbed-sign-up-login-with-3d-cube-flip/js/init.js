function Login(){
	var username = document.getElementById("Lemail").value;
	var password = document.getElementById("Lpassword").value;
	Parse.User.logIn(username, password, {
		success: function(user){
			console.log("login success!");
			window.location.href = "ui.html";
		},
		error: function(user, error){
			console.log("login failed... " + error.code + " " + error.message);
		}
	})

}

function signUp(){
	var user = new Parse.User();
	var firstname = document.getElementById("fname").value;
	var lastname = document.getElementById("lname").value;
	var username = document.getElementById("email").value;
	var password = document.getElementById("password").value;

	user.set("username", username);
	user.set("password", password);
	user.set("firstname",firstname);
	user.set("lastname", lastname);
	
	user.signUp(null, {
		success: function(user){
			console.log("success");
		},
		error: function(user, error){
			console.log("Parse error: " + error.code + " " + error.message);
		}
	});
}