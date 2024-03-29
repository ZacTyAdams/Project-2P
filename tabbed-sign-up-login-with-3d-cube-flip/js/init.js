var userProfile;

function signUp(){
	Parse.initialize("aCJKTtGB1GBe7BigaQuTiim9H7o3Gg6NAQrFu9xH", "B7ZpMdjyn7EhwyqGqovr7Wr2KzV2HtlhG7Te5YjJ");

	var user = new Parse.User();
	var firstname = document.getElementById("fname").value;
	var lastname = document.getElementById("lname").value;
	var username = document.getElementById("email").value;
	var password = document.getElementById("password").value;

	userProfile = {uname: username, fname: firstname, lname: lastname,};
	
	user.set("username", username);
	user.set("password", password);
	user.set("userprofile", userProfile);
	
	user.signUp(null, {
		success: function(user){
			console.log("success");
		},
		error: function(user, error){
			console.log("Parse error: " + error.code + " " + error.message);
		}
	});
}

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

function loader(){ //pulling saved user data into userpane
	Parse.initialize("aCJKTtGB1GBe7BigaQuTiim9H7o3Gg6NAQrFu9xH", "B7ZpMdjyn7EhwyqGqovr7Wr2KzV2HtlhG7Te5YjJ");
	userProfile = Parse.User.current().get("userprofile");
	//console.log(userProfile);
	//checkforMatched();
	//console.log("inside");
	document.getElementById("username").innerHTML = "Hello " + userProfile.fname + " " + userProfile.lname;
	if(userProfile.bio != undefined){
		document.getElementById("userbio").innerHTML = userProfile.bio;
	}
	if(userProfile.pic != undefined){
		document.getElementById('blah').src = userProfile.pic; 
	}
	if(userProfile.tags != undefined){
		document.getElementById("tagfield").innerHTML = userProfile.tags;
	}
	if(userProfile.matched != undefined){
		for(var i = 0; i<userProfile.matched.length; i++){
			var matched = document.createElement("LI");
			var matchedname = document.createElement("DIV");
			var matchednumber = document.createElement("DIV");
			var t = document.createTextNode(userProfile.matched[i].uname);
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
	
	userProfile.bio = document.getElementById("userbio").innerHTML;
	userProfile.tags = document.getElementById("tagfield").innerHTML.split(",");
	//console.log(document.getElementById("blah").src);
	if(document.getElementById("file-input").files[0] == null){
			//Parse.User.current().set("profilePic", Parse.User.current().get("profilePic"));
			//Parse.User.current().set("bio", document.getElementById("userbio").innerHTML);
			//Parse.User.current().set("firstname", Parse.User.current().get("firstname"));
			//Parse.User.current().set("lastname", Parse.User.current().get("lastname"));
			//Parse.User.current().set("username", Parse.User.current().get("username"));
			//Parse.User.current().set("tags", document.getElementById("tagfield").innerHTML);
			Parse.User.current().set("userprofile", userProfile);
			Parse.User.current().save(null, {
				success: function(user){
					console.log(userProfile);

				},
				error: function(error) {
					console.log("Information failed to update: " + error.code + " " + error.message);
				}
			});
	}
	else{
		var parseFile = new Parse.File("thing", document.getElementById("file-input").files[0]);
		parseFile.save().then(function(parseFile){
			userProfile.pic = parseFile.url();
			//Parse.User.current().set("profilePic", url);
			//Parse.User.current().set("bio", document.getElementById("userbio").innerHTML);
			//Parse.User.current().set("firstname", Parse.User.current().get("firstname"));
			//Parse.User.current().set("lastname", Parse.User.current().get("lastname"));
			//Parse.User.current().set("username", Parse.User.current().get("username"));
			Parse.User.current().set("userprofile", userProfile);
			Parse.User.current().save(null, {
				success: function(user){
					console.log(userProfile);

				},
				error: function(error) {
					console.log("Information failed to update: " + error.code + " " + error.message);
				}
			});
		});
	}
}

function matchFinder(){
	var query = new Parse.Query(Parse.User);
	
	query.exists("userprofile");
	query.find({
		success: function(result){
			//var possiblematch = [];
			for(x in result){
				if(result[x].get("userprofile").uname != userProfile.uname){
					var alreadymatched = false;
					var compare = userProfile.tags.concat(result[x].get("userprofile").tags).sort();
					for(var y = 0; y<compare.length; y++){
						//console.log(compare[y] + " " + compare[y+1]);
						if(compare[y] == compare[y+1] && !alreadymatched){
							temp = {prof: result[x].get("userprofile"), hits: 1};
							alreadymatched = true;
						}
						else if(compare[y] == compare[y+1] && alreadymatched){
							temp.hits++;
						}
					}
					if(alreadymatched){
						matches.push(temp);
					}
				}
			}
			console.log(matches);
		},
		error: function(error){
			console.log("nothingness");
			}
	});
}

function showMatches(){

	while(document.getElementById("matchlist").firstChild){
		document.getElementById("matchlist").removeChild(document.getElementById("matchlist").firstChild);
	}
	matches.sort(function(a, b){return b.hits-a.hits});

	for(var x = 0; x < matches.length; x++){
		console.log("user: " + matches[x].prof.uname + " " + "hits: " + matches[x].hits);
		var matchPic = document.createElement("IMG");
		matchPic.setAttribute('src', matches[x].prof.pic);
		matchPic.style.width = "25%";
		matchPic.style.height = "25%";
		var match = document.createElement("LI");
		match.setAttribute('onclick', "likePerson(" + x + ");");
		var t = document.createTextNode("user: " + matches[x].prof.uname + " " + "hits: " + matches[x].hits);
		match.appendChild(matchPic);
		match.appendChild(t);
		document.getElementById("matchlist").appendChild(match);
	}
}

function likePerson(ele){
	console.log(userProfile.liked);
	if(userProfile.liked == undefined){
		console.log("this may work");
		userProfile.liked = [];
		userProfile.liked.push(matches[ele].prof);
	}
	else{
		var isPresent = false;
		for(x in userProfile.liked){
			if(userProfile.liked[x].uname == matches[ele].prof.uname){
				isPresent = true;
				console.log("you already like this person!");
			}
		}
		if(!isPresent){
			userProfile.liked.push(matches[ele].prof);
		}

	}
	save();
	console.log(userProfile);
}

function checkforMatched(){
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
						if(Parse.User.current().get("matched") == undefined || Parse.User.current().get("matched") == ""){
							Parse.User.current().set("matched", matches[x]);
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
								Parse.User.current().set("matched", Parse.User.current().get("matched"));
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

var matches = [];

function sandbox(ele){
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
						if(Parse.User.current().get("matched") == undefined || Parse.User.current().get("matched") == ""){
							Parse.User.current().set("matched", matches[x]);
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
								Parse.User.current().set("matched", Parse.User.current().get("matched"));
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




