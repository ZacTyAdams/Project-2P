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
	if(Parse.User.current().get("tags") != undefined){
		document.getElementById("tagfield").innerHTML = Parse.User.current().get("tags");
	}
	if(Parse.User.current().get("matched") != undefined){
		var temp = Parse.User.current().get("matched").split(" ");
		console.log(temp);
		for(var i = 0; i<temp.length; i++){
			var matched = document.createElement("LI");
			var matchedname = document.createElement("DIV");
			var matchednumber = document.createElement("DIV");
			var t = document.createTextNode(temp[i]);
			var q = document.createTextNode(i+1);
			matchedname.appendChild(t);
			matchednumber.appendChild(q);
			matched.appendChild(matchednumber);
			matched.appendChild(matchedname);
			document.getElementById("matchedList").appendChild(matched);
		}
	}
	matchFinder();

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
			Parse.User.current().set("tags", document.getElementById("tagfield").innerHTML);
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

var array = [];
function matchFinder(){
	array =[];
	var tags = Parse.User.current().get("tags").split(" ");
	var query = new Parse.Query(Parse.User);

	for(var i = 0; i<tags.length; i++)
	{
		//console.log(tags[i]);
		query.contains("tags", tags[i]);
		query.find({
			success: function(result){
				for(var x = 0; x<result.length; x++){
					if(result[x].get("username") != Parse.User.current().get("username")){
						//console.log(result[x].get("username"));
						var isPresent = false;
						for(var y = 0; y<array.length; y++){
							//console.log("its in the for");
							if(array[y].name == result[x].get("username")){
								isPresent = true;
								array[y].hits++; 
							}
						}
						if(!isPresent){
							//console.log("its in");
							var match = {name: result[x].get("username"), hits: 1, pic: result[x].get("profilePic")};
							//console.log(match.name);
							array.push(match);
						}
					}
				}
			},
			error: function(error){
				console.log("nothingness");
			}
		});

	}
}

function showMatches(){

	while(document.getElementById("matchlist").firstChild){
		document.getElementById("matchlist").removeChild(document.getElementById("matchlist").firstChild);
	}
	array.sort(function(a, b){return b.hits-a.hits});

	for(var x = 0; x < array.length; x++){
		console.log("user: " + array[x].name + " " + "hits: " + array[x].hits);
		var matchPic = document.createElement("IMG");
		matchPic.setAttribute('src', array[x].pic);
		matchPic.style.width = "25%";
		matchPic.style.height = "25%";
		var match = document.createElement("LI");
		match.setAttribute('onclick', "likePerson(" + x + ");");
		var t = document.createTextNode("user: " + array[x].name + " " + "hits: " + array[x].hits);
		match.appendChild(matchPic);
		match.appendChild(t);
		document.getElementById("matchlist").appendChild(match);
	}
}

function likePerson(ele){
	if(Parse.User.current().get("liked") == undefined){
		Parse.User.current().set("liked", array[ele].name + " ");
		save();
		console.log("in the conditional");
	}
	else{
		console.log("in other statement");
		var temp = Parse.User.current().get("liked").split(" ");
		var isPresent = false;
		for(var i = 0; i<temp.length; i++){
			if(array[ele].name == temp[i]){
				isPresent = true;
			}
		}
		if(!isPresent){
			Parse.User.current().set("liked", Parse.User.current().get("liked") + array[ele].name + " ");
			save();
		}
	}

	console.log(array[ele].name);
}

function sandbox(){
	var matches = Parse.User.current().get("liked").split(" ");
	var query = new Parse.Query(Parse.User);
	query.contains("liked", Parse.User.current().get("username"));
	query.find({
		success: function(result){
			for(var i = 0; i<result.length; i++){
				for(var x = 0; x<matches.length; x++){
					if(result[i].get("username") == matches[x]){
						console.log("Match found: " + matches[x]);
						Parse.User.current().set("liked", Parse.User.current().get("liked"));
						if(Parse.User.current().get("matched") == undefined){
							Parse.User.current().set("matched", matches[x] + " ");
							save();
						}
						else{
							var temp = Parse.User.current().get("matched").split(" ");
							var isPresent = false;
							for(var y = 0; y<temp.length; y++){
								if(temp[y] == matches[x]){
									isPresent = true;
								}
							}
							if(!isPresent){
								Parse.User.current().set("matched", Parse.User.current().get("matched") + " ");
								save();
							}
						}
					}
				}
			}
			//console.log(result[0].get("username"));
		},
		error: function(error){
			console.log("did not find anything");
		}
	});
	//for(var i = 0; i<matches.length; i++){
	//	console.log(matches[i]);
	//}
}




