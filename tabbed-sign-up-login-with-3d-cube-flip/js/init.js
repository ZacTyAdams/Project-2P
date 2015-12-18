function Login(){
	Parse.initialize("aCJKTtGB1GBe7BigaQuTiim9H7o3Gg6NAQrFu9xH", "B7ZpMdjyn7EhwyqGqovr7Wr2KzV2HtlhG7Te5YjJ");

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
	});

}

function signUp(){
	Parse.initialize("aCJKTtGB1GBe7BigaQuTiim9H7o3Gg6NAQrFu9xH", "B7ZpMdjyn7EhwyqGqovr7Wr2KzV2HtlhG7Te5YjJ");

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

function tester(){
	Parse.initialize("aCJKTtGB1GBe7BigaQuTiim9H7o3Gg6NAQrFu9xH", "B7ZpMdjyn7EhwyqGqovr7Wr2KzV2HtlhG7Te5YjJ");

	console.log(Parse.User.current().get("firstname"));
}

function loader(){ //pulling saved user data into userpane
	Parse.initialize("aCJKTtGB1GBe7BigaQuTiim9H7o3Gg6NAQrFu9xH", "B7ZpMdjyn7EhwyqGqovr7Wr2KzV2HtlhG7Te5YjJ");
	
	console.log("inside");
	document.getElementById("username").innerHTML = "Hello " + Parse.User.current().get("firstname") + " " + Parse.User.current().get("lastname");
	if(Parse.User.current().get("bio") != undefined){
		document.getElementById("userbio").innerHTML = Parse.User.current().get("bio");
	}
	if(Parse.User.current().get("profilePic") != undefined){
		document.getElementById('blah').src = Parse.User.current().get("profilePic"); 
		console.log("pulling pic");
	}

}

function save(){
	Parse.initialize("aCJKTtGB1GBe7BigaQuTiim9H7o3Gg6NAQrFu9xH", "B7ZpMdjyn7EhwyqGqovr7Wr2KzV2HtlhG7Te5YjJ");
	
	console.log(document.getElementById("blah").src);
	if(document.getElementById("file-input").files[0] == null){
			Parse.User.current().set("profilePic", Parse.User.current().get("profilePic"));
			Parse.User.current().set("bio", document.getElementById("userbio").innerHTML);
			Parse.User.current().set("firstname", Parse.User.current().get("firstname"));
			Parse.User.current().set("lastname", Parse.User.current().get("lastname"));
			Parse.User.current().set("username", Parse.User.current().get("username"));
			Parse.User.current().save(null, {
				success: function(user){
					console.log(Parse.User.current().get("username"));

				},
				error: function(error) {
					console.log("Information failed to update: " + error.code + " " + error.message);
				}
			});
	}
	else{
		var parseFile = new Parse.File("thing", document.getElementById("file-input").files[0]);
		parseFile.save().then(function(parseFile){
			var url = parseFile.url();
			Parse.User.current().set("profilePic", url);
			Parse.User.current().set("bio", document.getElementById("userbio").innerHTML);
			Parse.User.current().set("firstname", Parse.User.current().get("firstname"));
			Parse.User.current().set("lastname", Parse.User.current().get("lastname"));
			Parse.User.current().set("username", Parse.User.current().get("username"));
			Parse.User.current().save(null, {
				success: function(user){
					console.log(Parse.User.current().get("username"));

				},
				error: function(error) {
					console.log("Information failed to update: " + error.code + " " + error.message);
				}
			});
		});
	}
}

function sandbox(){
	
}




