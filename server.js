var express = require('express');
var app = express();
var http = require('http');
var open = require('open');
var path = require('path');
var bodyParser = require("body-parser");
var spawnNode1 = require('child_process').spawn
var spawnNode2 = require('child_process').spawn

var typeCommand = '', powerCommand = '', uniCommand = '', broadCommand = ''; 
var meshCommand = '', sleep = '', sleepCoord = '', sleepCommand = '';
var wakeCommand = '', sampleCommand = '';

var getSleep = "", getSamp = "", getPower = "", getLed = "", getTemp = "", getHum = "", getBatt = "";
var tableSize = "", rTable = "", getLQI = "", getRstate = "";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/view_v2.html'));
});

app.post('/', function (req, res) {
	//Write mode operation
	if (req.body.action == "write") {
		console.log("Writing...");

		//If Node 1 architecture is selected
		if (req.body.nodeArch == 1) {
			//Connection to gdp_node1.py - file that handles node 1's GDP connection
			var pyWrite = spawnNode1('python', ['gdp_node1.py'])

			var dataString = []
			var dataOut = ''

			//Indicates write operation
			dataString.push("write");

			//Creation of GCL commands for node 1
			nodeName = req.body.nodeName;
			dataString.push(nodeName)

			if (req.body.nodeType != '') {
				nodeType = req.body.nodeType;
				typeCommand = "NT " + nodeType
				dataString.push(typeCommand)
			}

			if (req.body.sense != '') {
				sense = req.body.sense;

				if (sense == "start") senseCommand = "start"
				else senseCommand = "stop"

				dataString.push(senseCommand)
			}

			if (req.body.sampleTime != '') {
				sampleTime = req.body.sampleTime;
				sampleCommand = "ST " + sampleTime
				dataString.push(sampleCommand)
			}

			if (req.body.powerLevel != '') {
				powerLevel = req.body.powerLevel;
				powerCommand = "PL " + powerLevel.slice(0, 1)
				dataString.push(powerCommand)
			}

			if (req.body.unicast != '') {
				unicast = req.body.unicast;
				uniCommand = "RR " + unicast
				dataString.push(uniCommand)
			}
			if (req.body.broadcast != '') {
				broadcast = req.body.broadcast;
				broadCommand = "MT " + broadcast
				dataString.push(broadCommand)
			}
			if (req.body.mesh != '') {
				mesh = req.body.mesh;
				meshCommand = "MR " + mesh
				dataString.push(meshCommand)
			}

			if (req.body.sleep == "true") {
				sleep = "sleep"
				dataString.push(sleep)
			}

			sleepCoord = req.body.sleepCoord;

			if (req.body.sleepPeriod != '') {
				sleepPeriod = req.body.sleepPeriod;
				sleepCommand = "SP " + sleepPeriod
				dataString.push(sleepCommand)
			}
			
			if (req.body.wakeTime != '') {
				wakeTime = req.body.wakeTime;
				wakeCommand = "WT " + wakeTime
				dataString.push(wakeCommand)
			}

			console.log(dataString);

			//Sending of write commands to the python file
			pyWrite.stdin.write(JSON.stringify(dataString));
			pyWrite.stdin.end();

			//For testing purposes
			pyWrite.stdout.on('data', function(data){
			  dataOut = data.toString();
			});
			pyWrite.stdout.on('end', function(){
			  console.log('Write = ', dataOut);
			});
		
			res.end("Data successfully updated");
		}
		else {
			//Connection to gdp_node2.py - file that handles node 2's GDP connection
			var pyWriteNode2 = spawnNode2('python', ['gdp_node2.py'])
			
			var dataString = []
			var dataOut = []
			
			//Indicates write operation
			dataString.push("write");

			//Creation of GCL commands for node 2
			nodeName = req.body.nodeName;
			
			if (req.body.sense != '') {
				sense = req.body.sense;

				switch(sense) {
					case "start":
						senseCommand = "S " + nodeName
						break
					case "stop":
						senseCommand = "X " + nodeName
						break
					case "sleep":
						senseCommand = "Z " + nodeName
						break
					case "ping":
						senseCommand = "P " + nodeName
				}

				dataString.push(senseCommand)
			}
			
			if (req.body.powerLevel != '') {
				powerLevel = req.body.powerLevel;
				powerCommand = "C " + nodeName + " TX " + powerLevel
				dataString.push(powerCommand)
			}
			
			if (req.body.sampleTime != '') {
				sampleTime = req.body.sampleTime;
				sampleCommand = "C " + nodeName + " ST " + sampleTime
				dataString.push(sampleCommand)
			}
			
			if (req.body.sleepPeriod != '') {
				sleepPeriod = req.body.sleepPeriod;
				sleepCommand = "C " + nodeName + " ZT " + sleepPeriod
				dataString.push(sleepCommand)
			}
			
			if (req.body.ledState != '') {
				ledState = "C " + nodeName + " LD " + req.body.ledState
				dataString.push(ledState)
			}
			
			if (req.body.changeRoute != '') {
				changeRoute = "N " + nodeName + " CR " + req.body.changeRoute
				dataString.push(changeRoute)
			}

			if (req.body.rmRoute != '') {
				removeRoute = "N " + nodeName + " RM " + req.body.rmRoute
				dataString.push(removeRoute)
			}

			console.log(dataString);

			//Sending of write commands to the python file
			pyWriteNode2.stdin.write(JSON.stringify(dataString));
			pyWriteNode2.stdin.end();

			//For testing purposes
			pyWriteNode2.stdout.on('data', function(data){
			  dataOut.push(data.toString());
			});
			pyWriteNode2.stdout.on('end', function(){
				console.log(dataOut);
			});
		
			res.end("Data successfully updated");
		}
	}
	//Read mode operation
	else if (req.body.action == "read") {
		console.log("Reading...");

		//If node 2 architecture is selected
		if (req.body.nodeArch == 1) {
			//Connection to gdp_node1.py
			var pyRead = spawnNode1('python', ['gdp_node1.py'])
		
			var dataIn = []
			var dataRead = ''
			var read = ''

			//Indicates read operation
			dataIn.push("read");
			
			nodeName = req.body.nodeName;
			dataIn.push(nodeName);
			
			pyRead.stdin.write(JSON.stringify(dataIn));
			pyRead.stdin.end();

			//Reading of data sent by the gdp_node1.py
			pyRead.stdout.on('data', function(data){
			  dataRead = data.toString();
			});

			//Parse data into data types
			pyRead.stdout.on('end', function(){
				console.log('Read = ', dataRead);
				read = dataRead.split(',');

				nodeData = {
					nodeNameResp : nodeName,
					//nodeTypeResp : read[1],
					powerLevelResp : read[1],
					//senseResp:
					sampleTimeResp : read[2],
					unicastResp : read[2],
					broadcastResp : read[3],
					meshResp : read[4],
					//sleepResp: 
					//sleepCoordResp : sleepCoord,
					sleepPeriodResp : read[5],
					wakeTimeResp : read[6]
				}
				
				//Sending of the parsed data to the web application
				res.writeHead(200, {"Content-Type" : "application/json"});
				var json = JSON.stringify(nodeData);
				res.end(json);
			});
		
		}
		else {
			//Connection to gdp_node2.py
			var pyReadNode2 = spawnNode2('python', ['gdp_node2.py'])
			
			var dataIn = []
			var dataRead = []
			var read = ''
			var i
			
			//Indicates read operation
			dataIn.push("read");
			
			//Creation of GCL read commands for node 2
			nodeName = req.body.nodeName;

			if (req.body.readSleep == 1) {
				readCommand = "R " + nodeName + " ZT";
				dataIn.push(readCommand);
			}

			if (req.body.readSamp == 1) {
				readCommand = "R " + nodeName + " ST";
				dataIn.push(readCommand);
			}

			if (req.body.readPower == 1) {
				readCommand = "R " + nodeName + " TX";
				dataIn.push(readCommand);
			}

			if (req.body.readLed == 1) {
				readCommand = "R " + nodeName + " LD";
				dataIn.push(readCommand);
			}

			if (req.body.readTHB == 1) {
				readCommand = "R " + nodeName + " SN";
				dataIn.push(readCommand);
			}

			if (req.body.readTemp == 1) {
				readCommand = "R " + nodeName + " TP";
				dataIn.push(readCommand);
			}

			if (req.body.readHum == 1) {
				readCommand = "R " + nodeName + " HM";
				dataIn.push(readCommand);
			}

			if (req.body.readBatt == 1) {
				readCommand = "R " + nodeName + " BT";
				dataIn.push(readCommand);
			}

			if (req.body.readRtable == 1) {
				readCommand = "R " + nodeName + " RT";
				dataIn.push(readCommand);
			}

			if (req.body.readLQI != '') {
				readCommand = "N " + nodeName + " LQ " + req.body.readLQI;
				dataIn.push(readCommand);
			}

			if (req.body.readRstate != '') {
				readCommand = "N " + nodeName + " RS " + req.body.readRstate;
				dataIn.push(readCommand);
			}

			console.log(dataIn);

			//Sending of read commands to the python file
			pyReadNode2.stdin.write(JSON.stringify(dataIn));
			pyReadNode2.stdin.end();

			//Reading of data sent by the gdp_node2.py
			pyReadNode2.stdout.on('data', function(data){
			  dataRead.push(data.toString());
			});

			//Parse data into data types
			pyReadNode2.stdout.on('end', function(){
				console.log('Read = ', dataRead);
				read = dataRead[0].split(',');

				for(i = read.length-1; i >= 0; i--) {

					switch(read[i].slice(3,6)) {
						case "209": //ZT
							getSleep = read[i].slice(6);
							break;
						case "210": //ST
							getSamp = read[i].slice(6);
							break;
						case "211": //TX
							getPower = read[i].slice(6);
							break;
						case "212": //RX
							break;
						case "213": //LD
							getLed = read[i].slice(6);
							break;
						case "214": //TP
							getTemp = read[i].slice(6);
							break;
						case "215": //HM
							getHum = read[i].slice(6);
							break;
						case "216": //BT
							getBatt = read[i].slice(6);
							break;
						case "217": //SN
							break;
						case "226": //RT
							tableSize = read[i].slice(7,8);
							rTable = read[i].slice(9);
							break;
						case "227": //LQ
							getLQI = read[i].slice(6);
							break;
						case "228": //RS
							getRstate = read[i].slice(6);
					}

				}

				nodeData = {
					nodeNameResp: nodeName,
					sleepResp: getSleep,
					sampResp: getSamp,
					powerResp: getPower,
					ledResp: getLed,
					tempResp: getTemp,
					humResp: getHum,
					battResp: getBatt,
					rtSizeResp: tableSize,
					rTableResp: rTable,
					lqiResp: getLQI,
					rStateResp: getRstate
				}

				//Sending of the parsed data to the web application
				res.writeHead(200, {"Content-Type" : "application/json"});
				var json = JSON.stringify(nodeData);
				res.end(json);
			});
		
		}

	}

})

app.listen(1080, function () {
	console.log('App listening on port 1080!');
	//open('http://localhost:1080');
});
