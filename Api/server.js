const express = require('express');
const {PythonShell} = require ('python-shell');
const csv = require('csvtojson');

const fs = require('fs');
const port = process.env.PORT || 80

const app = express();
const bodyParser = require("body-parser");
let checkusername = "";
let instaUsername = "";
let twitterUsername = "";
let stringToFind="";
let lattitude="";
let longitude="";
let radius="";
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/../public"));
app.use(express.static(__dirname+"/../Python_Scripts/result"));
const port = process.env.port || 3000;
//* GET Routes
app.get('/', (req, res) => {
	res.render('index.ejs');
});
app.get('/contact', (req, res) => {
	res.render('contact.ejs');
});
app.get('/geotagging',(req,res)=>{
	res.render('map.ejs')
})
app.get('/twitteranalysis',(req,res)=>{
	res.render('twitterAnalysis.ejs')
})
app.get('/similarhashtags',(req,res)=>{
	res.render('hashtagAnalysis.ejs')
})
app.get('/usertrends',(req,res)=>{
	res.render('trendsAnalysis.ejs')
})
app.get('/accountcheck',(req,res)=>{
	res.render('accountcheck.ejs')
})
app.get('/instagram',(req,res)=>{
	res.render('instagram.ejs')
})
app.get('/documentation',(req,res)=>{
	res.render('documentation.ejs')
})
// app.get('/test',(req,res)=>{
// 	let coordinates = "28.617245604288797, 77.20818042755127"
// 	res.render('twitterOutput.ejs',{data:coordinates});
// })


app.get('/instagram/result',(req,res)=>{
	let options = {
		mode: 'text', 
		pythonOptions: ['-u'], // get print results in real-time
		scriptPath: `${__dirname}/../Python_Scripts/instagram`,
		args: [instaUsername]
	}
	PythonShell.run('main.py', options, function (err, results) {
		if (err) throw err;
		// results is an array consisting of messages collected during execution
		let rawdata = fs.readFileSync(`${__dirname}/../Python_Scripts/result/instagram/instagram_${instaUsername}/instagram_${instaUsername}.json`);
		let data = JSON.parse(rawdata);
		console.log(data);
		res.render('instaOutput.ejs',{data:data})
	});
});

app.get('/geotagging/result',(req,res)=>{
	let options = {
		mode: 'text', 
		scriptPath:`${__dirname}/../Python_Scripts/geolocation_analysis`,
		args: [lattitude,longitude,radius]
	}
	PythonShell.run('top_mentions_hashtags_geo.py', options, function (err, results) {
		if (err) throw err;
		else{
			console.log(results)
			let coordinates = `${lattitude}, ${longitude}`
			res.render('twitterOutput.ejs',{data:coordinates});
		}
		
	});
	
});

app.get('/twitter/result',(req,res)=>{
	let options = {
		mode: 'text', 
		pythonOptions: ['-u'], // get print results in real-time
		scriptPath: `${__dirname}/../Python_Scripts/twitter`,
		args: [twitterUsername,stringToFind]
	}
	PythonShell.run('func_call.py', options, function (err, results) {
		if (err) throw err;
		else{
			 res.render('twitterUserOutput.ejs',{username:twitterUsername});
		}
		
	});
})

app.get('/similarhashtags/result',(req,res)=>{
	let options = {
		mode: 'text',
		pythonOptions: ['-u'], // get print results in real-time
		scriptPath: `${__dirname}/../Python_Scripts/twitter/similar_hashtags`,
		args: [twitterHashtag]
	}
	PythonShell.run('similar_hashtags.py', options, function (err, results) {
		if (err) throw err;
		else{
			 twitterHashtag = twitterHashtag.replace("#","");
			 //console.log(twitterHashtag);
			 res.render('hashtagsOutput.ejs',{data:twitterHashtag});
		}

	});
})

app.get('/usertrends/result',(req,res)=>{
	let options = {
		mode: 'text',
		pythonOptions: ['-u'], // get print results in real-time
		scriptPath: `${__dirname}/../Python_Scripts/twitter/top_mentions_hashtags`,
		args: [twitterUsername]
	}
	PythonShell.run('top_mentions_hashtags.py', options, function (err, results) {
		if (err) throw err;
		else{
			 res.render('twitterOutput.ejs',{data:twitterUsername});
		}

	});
})

app.get('/username/result',(req,res)=>{
	let options = {
		mode: 'text',
		pythonOptions: ['-u'], // get print results in real-time
		scriptPath: `${__dirname}/../Python_Scripts/username_check/`,
		args: [checkusername]
	}
	PythonShell.run('check.py', options, function (err, results) {
		if (err) throw err;
		else{
			 res.render('accountcheckOutput.ejs',{data:checkusername});
		}
	});
})
	// console.log('username is',username);
	// 	const python = spawn('python', [
	// 	'D:\\Web Development\\OSINT-Tool\\Python_Scripts\\instagram\\main.py'
	// ]);
	// 	python.on('close', (code) => {
	// 	console.log(`child process close all stdio with code ${code}`);
	// 	// send data to browser
	// });
	// python.stdout.on('data', function (data) {
	// 	console.log('Pipe data from python script ...');
	// 	dataToSend = data.toString();
	// 	res.send(dataToSend);
	// });

// app.get('/api', (req, res) => {
// 	var dataToSend;
// 	// spawn new child process to call the python script

// 	// collect data from script

// 	// in close event we are sure that stream from child process is closed
// 	python.on('close', (code) => {
// 		console.log(`child process close all stdio with code ${code}`);
// 		// send data to browser
// 	});
// });

// app.get('/result', (req, res) => {
// 	const csv = require('csvtojson');
// 	// Invoking csv returns a promise

// 	const converter = csv()
// 		.fromFile(__dirname + '/../demo_result/result.csv')
// 		.then((json) => {
// 			console.log(json);
// 			res.send(json);
// 		});
// });
//*POST
app.post('/accountcheck',(req,res)=>{
	checkusername = req.body.username;//saving username in the current session storage
	console.log('username',checkusername);
	res.redirect('/username/result');//redircting to send basic result
})
app.post('/instagram',(req,res)=>{
	instaUsername = req.body.username;//saving username in the current session storage
	console.log('username',instaUsername);
	res.redirect('/instagram/result');//redircting to send basic result
})
app.post('/twitter',(req,res)=>{
	twitterUsername = req.body.username//saving username in the current session storage
	stringToFind = req.body.string;
	console.log(twitterUsername,stringToFind)
	res.redirect('/twitter/result');//redircting to send basic result
})
// app.post('/hashtags',(req,res)=>{
// 	twitterHashtag = req.body.hashtag//saving hashtag in the current session storage
// 	console.log(twitterHashtag)
// 	res.redirect('/similarhashtags/result');//redircting to send basic result
// })
app.post('/userTrendsAction',(req,res)=>{
	twitterUsername = req.body.username//saving hashtag in the current session storage
	console.log(twitterUsername)
	res.redirect('/usertrends/result');//redircting to send basic result
})
app.post('/geotagging',(req,res)=>{
	lattitude = req.body.lattitude;
	longitude = req.body.longitude;
	radius = req.body.radius;
	console.log(radius,lattitude,longitude)
	res.redirect('/geotagging/result')
})
const server = app.listen(process.env.port || 80, () =>
	console.log(`Example app listening on port 
${port}!`)
);

server.timeout = 480000;
