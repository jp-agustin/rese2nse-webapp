$(document).ready(function()
{

	var action = "write";
	var architecture = 2;

	displayForms();
	updateSliderVals();

	$("#read-node1").click(function()
	{
		action = "read";
		architecture = 1;
		displayForms();
	});

	$("#write-node1").click(function()
	{
		action = "write";
		architecture = 1;
		displayForms();
	});

	$("#read-node2").click(function()
	{
		action = "read";
		architecture = 2;
		displayForms();
	});

	$("#write-node2").click(function()
	{
		action = "write";
		architecture = 2;
		displayForms();
	});

	$(document).on('input change', '#unicast', function()
	{
		updateSliderVals();
	});

	$(document).on('input change', '#broadcast', function()
	{
		updateSliderVals();
	});

	$(document).on('input change', '#mesh', function()
	{
		updateSliderVals();
	});

	$("#sleep").click(function()
	{
		if ($("#sleep").is(':checked'))
		{	
			if (architecture == 1)
			{
				$("#sleepCoord").removeAttr('checked');
				$("#sleepCoord").attr("disabled", true);
				
				$("#wakeTime").val("");
				$("#checkWakeTime").removeAttr('checked');
				$("#checkWakeTime").attr("disabled", true);
			}
			
			$("#sleepPeriod").val("");
			$("#checkSleepPeriod").removeAttr('checked');
			$("#checkSleepPeriod").attr("disabled", true);

		}
		else
		{
			if (architecture == 1)
			{
				$("#sleepCoord").attr("disabled", false);
				$("#checkWakeTime").attr("disabled", false);
			}
			
			$("#checkSleepPeriod").attr("disabled", false);
		}
	});
	
	$("#sleepCoord").click(function()
	{
		if ($("#sleepCoord").is(':checked'))
		{
			$("#sleep").removeAttr('checked');
			$("#sleep").attr("disabled", true);

			$("#sleepPeriod").val("");
			$("#checkSleepPeriod").removeAttr('checked');
			$("#checkSleepPeriod").attr("disabled", true);

			$("#wakeTime").val("");
			$("#checkWakeTime").removeAttr('checked');
			$("#checkWakeTime").attr("disabled", true);
		}
		else
		{
			$("#sleep").attr("disabled", false);
			$("#checkSleepPeriod").attr("disabled", false);
			$("#checkWakeTime").attr("disabled", false);
		}
	});

	$("#checkSleepPeriod").click(function()
	{
		if ($("#checkSleepPeriod").is(':checked') || $("#checkWakeTime").is(':checked'))
		{
			$("#sleep").removeAttr('checked');
			$("#sleep").attr("disabled", true);
			
			if (architecture == 1)
			{
				$("#sleepCoord").removeAttr('checked');
				$("#sleepCoord").attr("disabled", true);
			}
		}
		else
		{
			$("#sleep").attr("disabled", false);
			$("#sleepCoord").attr("disabled", false);
		}
	});

	$("#checkWakeTime").click(function()
	{
		if ($("#checkWakeTime").is(':checked') || $("#checkSleepPeriod").is(':checked'))
		{
			$("#sleep").removeAttr('checked');
			$("#sleep").attr("disabled", true);

			$("#sleepCoord").removeAttr('checked');
			$("#sleepCoord").attr("disabled", true);
		}
		else
		{
			$("#sleep").attr("disabled", false);
			$("#sleepCoord").attr("disabled", false);
		}
	});

	$("#readTHB").click(function()
	{
		if ($("#readTHB").is(':checked'))
		{
			$("#readTemp").removeAttr('checked');
			$("#readTemp").attr("disabled", true);

			$("#readHumidity").removeAttr('checked');
			$("#readHumidity").attr("disabled", true);

			$("#readBattery").removeAttr('checked');
			$("#readBattery").attr("disabled", true);
		}
		else
		{
			$("#readTemp").attr("disabled", false);
			$("#readHumidity").attr("disabled", false);
			$("#readBattery").attr("disabled", false);
		}
	});

	var writeResponse = "";
	$("#submitForm").click(function() {
		var name = $("#nodeName").val();

		if (name == null || name == "")
		{
			alert("Please enter node name!");
			return;
		}

		if (action == "write")
		{
			alert("Will write!");
			writeResponse += "<h4>";
			writeResponse += "Node Name: " + name + "<br>";

			if (architecture == 1)
			{
				$.post("http://localhost:1080",
					{
						action : 'write',
						nodeName : name,
						nodeArch: getNodeArch(),
						nodeType : getNodeType(),
						powerLevel : getPowerLevel(),
						sense: getSensing(),
						sampleTime : getSampleTime(),
						unicast : getUnicast(),
						broadcast : getBroadcast(),
						mesh : getMesh(),
						sleep: getSleep(),
						sleepCoord : getSleepCoord(),
						sleepPeriod : getSleepPeriod(),
						wakeTime : getWakeTime(),
					},
					function(data,status)
					{
						alert(data);
					}
				);
			}
			else
			{
				$.post("http://localhost:1080",
					{
						action : 'write',
						nodeName : name,
						nodeArch: getNodeArch(),
						powerLevel : getPowerLevel(),
						sense: getSensing(),
						sampleTime : getSampleTime(),
						sleepPeriod : getSleepPeriod(),
						ledState: getLedState(),
						changeRoute: getChangeRoute(),
						rmRoute: getRemoveRoute()
					},
					function(data,status)
					{
						alert(data);
					}
				);				
			}
			
			writeResponse += "</h4>";

			clearForms();
			hideForms();
			$("#writeResponse").html(writeResponse);
			$("#writeResponse").show();
			writeResponse = "";
		}
		else
		{
			alert("Will read!");
			if (getNodeArch() == 1)
			{
				$.post("http://localhost:1080",
					{
						action : 'read',
						nodeName : name,
					},
					function(data, status)
					{
						var readResponse = "<h4>";

						readResponse += "Node Name: " + data.nodeNameResp + "<br>";
						readResponse += "Node Type: " + data.nodeTypeResp + "<br>";
						readResponse += "Power Level: " + data.powerLevelResp + "<br>";
						readResponse += "Sensing: " + data.senseResp + "<br>";
						readResponse += "Sample Time: " + data.sampleTimeResp + "<br>";
						readResponse += "Unicast: " + data.unicastResp + "<br>";
						readResponse += "Broadcast: " + data.broadcastResp + "<br>";
						readResponse += "Mesh Network: " + data.meshResp + "<br>";
						readResponse += data.sleepResp == "true" ? "Node is in sleep mode. <br>" : "";
						readResponse += data.sleepCoordResp == "true" ? "Node is a sleep coordinator. <br>" : "";
						readResponse += "Sleep Period (in ms): " + data.sleepPeriodResp + "<br>";
						readResponse += "Wake Time (in ms): " + data.wakeTimeResp + "<br>"; 
						readResponse += "</h4>"

						clearForms();
						hideForms();
						$("#readResponse").html(readResponse);
						$("#readResponse").show();
					}
				);
			}
			else
			{
				$.post("http://localhost:1080",
					{
						action : 'read',
						nodeName : name,
						readSleep: readSleep(),
						readSamp: readSamp(),
						readPower: readPower(),
						readLed: readLed(),
						readTHB: readTHB(),
						readTemp: readTemp(),
						readHum: readHum(),
						readBatt: readBatt(),
						readRtable: readRoutingTable(), 
						readLQI: readLqi(),
						readRstate: readRstate()
					},
					function(data, status)
					{
						var readResponse = "<h4>";
						var rtSize = data.rtSizeResp;
						var rTable = []
						rTable = data.rTableResp.split(' ');
						var rState = $("#routingState").val();
						var lqi = $("#linkQuality").val();

						readResponse += "Node Name: " + data.nodeNameResp + "<br>";
						readResponse += readSleep() == 1 ? "Sleep Time: " + data.sleepResp + " ms <br>" : "";
						readResponse += readSamp() == 1 ? "Sampling Time: " + data.sampResp + " ms <br>" : "";
						readResponse += readPower() == 1 ? "Power Level: " + data.powerResp + "<br>" : "";
						readResponse += readLed() == 1 ? "LED State: " + data.ledResp + "<br>" : "";
						readResponse += readTHB() == 1 ? "Temperature: " + data.tempResp + "<br>" + "Humidity: " + data.humResp + "<br>" + "Battery: " + data.battResp + "<br>" : "";
						readResponse += readTemp() == 1 ? "Temperature: " + data.tempResp + "<br>" : "";
						readResponse += readHum() == 1 ? "Humidity: " + data.humResp + "<br>" : "";
						readResponse += readBatt() == 1 ? "Battery: " + data.battResp + "<br>" : "";
						readResponse += (lqi == 1 && readLqi() != '') ? "Link Quality: " + data.lqiResp + "<br>" : "";
						readResponse += (rState == 1 && readRstate() != '') ? "Routing State: " + data.rStateResp + "<br>" : "";						
						readResponse += "</h4>"

						if (readRoutingTable())
						{
							var size = 0;
							readResponse += "<br> <table class='table table-bordered'>";
							readResponse += "<tr> <th class='th-res'> Fixed </th> <th class='th-res'> Multicast </th> <th class='th-res'> Reserved </th> <th class='th-res'> Score </th> <th class='th-res'> Dest </th> <th class='th-res'> Nexthop </th> <th class='th-res'> Rank </th> <th class='th-res'> LQI </th> </tr>";

							for (var i=0; i<rtSize; i++) {
								readResponse += "<tr>"
								for (var j=0; j<8; j++) {
									readResponse += "<td>" + rTable[size] + "</td>";
									size += 1;
								}
								readResponse += "</tr>";
							}

							readResponse += "</table>";
						}

						clearForms();
						hideForms();
						$("#readResponse").html(readResponse);
						$("#readResponse").show();

					}
				);
			}

			$("#nodeName").val("");
		}
	});

	$("input[name=action]").click(displayForms);
	$("#nodeArch").change(displayForms);

	function updateSliderVals()
	{
		$('#unicastVal').html($("#unicast").val());
		$('#broadcastVal').html($("#broadcast").val());
		$('#meshVal').html($("#mesh").val());
	}

	function displayForms() {
		$("#submitForm").show();
		$("#resetForm").show();
		clearForms();

		$("#readWrite").show();
		$("#nodeArchDiv").show();
		$("#nodeNameDiv").show();


		if (architecture == 1)
		{
			$("#Node1").show();
			$("#Node2").hide();

			if (action == "write")
			{
				$("#nodeTypeDiv").show();
				$("#instCommandDiv").hide();
				$("#changeParamDiv").hide();
				$("#powerLevelDiv").show();
				$("#powerLevel2Div").hide();
				$("#sensingDiv").show();
				$("#sampleTimeDiv").show();
				$("#retransmissionsDiv").show();
				$("#sleepCycleDiv").show();
				$("#SleepCoordDiv").show();
				$("#sleepPeriodDiv").show();
				$("#wakeTimeDiv").show();
				$("#ledStateDiv").hide();
				$("#readParamDiv").hide();				
				$("#routingTableWrite").hide();
				$("#routingTableRead").hide();
			}
			else
			{
				$("#nodeTypeDiv").hide();
				$("#instCommandDiv").hide();
				$("#changeParamDiv").hide();
				$("#powerLevelDiv").hide();
				$("#powerLevel2Div").hide();
				$("#sensingDiv").hide();
				$("#sampleTimeDiv").hide();
				$("#retransmissionsDiv").hide();
				$("#sleepCycleDiv").hide();
				$("#SleepCoordDiv").hide();
				$("#sleepPeriodDiv").hide();
				$("#wakeTimeDiv").hide();
				$("#ledStateDiv").hide();
				$("#readParamDiv").hide();				
				$("#routingTableWrite").hide();
				$("#routingTableRead").hide();
			}
		}
		else
		{
			$("#Node1").hide();
			$("#Node2").show();

			if (action == "write")
			{
				$("#nodeTypeDiv").hide();
				$("#instCommandDiv").show();
				$("#changeParamDiv").show();
				$("#powerLevelDiv").hide();
				$("#powerLevel2Div").show();
				$("#sensingDiv").hide();
				$("#sampleTimeDiv").show();
				$("#retransmissionsDiv").hide();
				$("#sleepCycleDiv").hide();
				$("#SleepCoordDiv").hide();
				$("#sleepPeriodDiv").show();
				$("#wakeTimeDiv").hide();
				$("#ledStateDiv").show();
				$("#readParamDiv").hide();				
				$("#routingTableWrite").show();
				$("#routingTableRead").hide();
			}
			else
			{
				$("#nodeTypeDiv").hide();
				$("#instCommandDiv").hide();
				$("#changeParamDiv").hide();
				$("#powerLevelDiv").hide();
				$("#powerLevel2Div").hide();
				$("#sensingDiv").hide();
				$("#sampleTimeDiv").hide();
				$("#retransmissionsDiv").hide();
				$("#sleepCycleDiv").hide();
				$("#SleepCoordDiv").hide();
				$("#sleepPeriodDiv").hide();
				$("#wakeTimeDiv").hide();
				$("#ledStateDiv").hide();
				$("#readParamDiv").show();				
				$("#routingTableWrite").hide();
				$("#routingTableRead").show();
			}
		}
	}

	function clearForms()
	{
		$("#nodeName").val("");
		$("#nodeType").val(0);

		$("#powerLevel").val("none");
		$("#powerLevel2").val("none");
		
		$("input[name=sense][value=none]").prop('checked', true);
		$("input[name=instComm][value=none]").prop('checked', true);
		
		$("#sampleTime").val("");

		$("#unicast").val(15);
		$("#broadcast").val(3);
		$("#mesh").val(1);
		updateSliderVals();

		$("#sleep").attr("disabled", false);
		$("#sleepCoord").attr("disabled", false);
		$("#checkSleepPeriod").attr("disabled", false);
		$("#checkWakeTime").attr("disabled", false);
		$("input[type=checkbox]").prop("checked", false);
		$("#sleepPeriod").val("");
		$("#wakeTime").val("");

		$("#ledState").val("none");
		$("#readTHB").attr("disabled", false);
		$("#readTemp").attr("disabled", false);
		$("#readHumidity").attr("disabled", false);
		$("#readBattery").attr("disabled", false);

		$("#chFixed").val("");
		$("#chMult").val("");
		$("#chScore").val("");
		$("#chDest").val("");
		$("#chNext").val("");

		$("#rmDest").val("");
		$("#rmMult").val("");

		$("#lqDest").val("");
		$("#lqMult").val("");

		$("#stateDest").val("");
		$("#stateMult").val("");

		$("#writeResponse").html("");
		$("#writeResponse").hide();

		$("#readResponse").html("");
		$("#readResponse").hide();
	}

	function hideForms()
	{
		$("#nodeNameDiv").hide();
		$("#nodeTypeDiv").hide();
		$("#instCommandDiv").hide();
		$("#changeParamDiv").hide();
		$("#powerLevelDiv").hide();
		$("#powerLevel2Div").hide();
		$("#sensingDiv").hide();
		$("#sampleTimeDiv").hide();
		$("#retransmissionsDiv").hide();
		$("#sleepCycleDiv").hide();
		$("#SleepCoordDiv").hide();
		$("#sleepPeriodDiv").hide();
		$("#wakeTimeDiv").hide();
		$("#ledStateDiv").hide();
		$("#readParamDiv").hide();				
		$("#routingTableWrite").hide();
		$("#routingTableRead").hide();
		$("#submitForm").hide();
		$("#resetForm").hide();
	}

	function getNodeArch()
	{
		var nodeArch = architecture;

		// writeResponse += "Node Architecture: " + nodeArch + "<br>";
		return nodeArch;
	}

	function getNodeType()
	{
		var nodeType = $("#nodeType").val();

		if ($("#checkType").is(':checked'))
		{
			if (nodeType == 0)
			{
				alert("Please select node type!");
				return;
			}
			else
			{
				writeResponse += "Node Type: " + nodeType + "<br>";
				return nodeType;
			}
		}
		return '';
	}

	function getPowerLevel()
	{
		if (architecture == 1)
		{
			var powerLevel = $("#powerLevel").val();

			if ($("#checkPowerLevel").is(':checked'))
			{
				if (powerLevel == "none")
				{
					alert("Please select power level!");
					return;
				}
				else
				{
					writeResponse += "Power Level: " + powerLevel + "<br>";
					return powerLevel;
				}
			}

			return '';
		}
		else
		{
			var powerLevel = $("#powerLevel2").val();

			if ($("#checkPowerLevel2").is(':checked'))
			{
				if (powerLevel == "none")
				{
					alert("Please select power level!");
					return;
				}
				else
				{
					writeResponse += "Power Level: " + powerLevel + "<br>";
					return powerLevel;
				}
			}

			return '';
		}
	}

	function getSensing()
	{
		if (architecture == 1)
		{
			var sensingOption = $("input[name=sense]:checked").val();

			if (sensingOption != "none")
			{
				writeResponse += "Sensing option: " + sensingOption + "<br>";
				return sensingOption;
			}

			return '';
		}
		else
		{
			var sensingOption = $("input[name=instComm]:checked").val();

			if (sensingOption != "none")
			{
				writeResponse += "Sensing option: " + sensingOption + "<br>";
				return sensingOption;
			}

			return '';
		}
	}		

	function getSampleTime()
	{
		var sampleTime = $("#sampleTime").val();

		if ($("#checkSampleTime").is(':checked')) {
			if (sampleTime != '')
			{
				if ($.isNumeric(sampleTime))
				{
					writeResponse += "Sample Time (in ms): " + sampleTime + "<br>";
					return sampleTime;
				}
				else
				{
					alert("Please enter a numeric value for sample time!");
					return;
				}
			}
			else
			{
				alert("Please enter data for the sample time!");
				return;
			}
		}

		return '';
	}

	function getUnicast()
	{
		var unicast = $("#unicast").val();

		if ($("#checkUnicast").is(':checked'))
		{
			writeResponse += "Unicast: " + unicast + "<br>";
			return unicast;
		} 

		return '';
	}

	function getBroadcast()
	{
		var broadcast = $("#broadcast").val();

		if ($("#checkBroadcast").is(':checked'))
		{
			writeResponse += "Broadcast: " + broadcast + "<br>";
			return broadcast;
		} 

		return '';
	}

	function getMesh()
	{
		var mesh = $("#mesh").val();

		if ($("#checkMesh").is(':checked'))
		{
			writeResponse += "Mesh Network: " + mesh + "<br>";
			return mesh;
		} 

		return '';
	}

	function getSleep()
	{
		if ($("#sleep").is(':checked'))
		{
			writeResponse +=  $("#nodeName").val() + " set in sleep mode" + "<br>";
			return "true";
		}

		return "false";
	}

	function getSleepCoord()
	{
		if ($("#sleepCoord").is(':checked'))
		{
			writeResponse +=  $("#nodeName").val() + " set as sleep coordinator" + "<br>";
			return "true";
		}

		return "false";
	}

	function getSleepPeriod()
	{
		var sleepPeriod = $("#sleepPeriod").val();

		if ($("#checkSleepPeriod").is(':checked'))
		{
			if (sleepPeriod != '')
			{
				if ($.isNumeric(sleepPeriod))
				{
					writeResponse += "Sleep Period (in ms): " + sleepPeriod + "<br>";
					return sleepPeriod;
				}
				else if (sleepPeriod < 1 || sleepPeriod > 1440000)
				{
					alert("Allowed values for sleep period are from 1 - 1 440 000 ms only!");
					return;
				}
				else
				{
					alert("Please enter a numeric value for sleep period!");
					return;
				}
			}
			else
			{
				alert("Please enter data for the sleep period!");
				return;
			}
		}

		return '';
	}

	function getWakeTime()
	{
		var wakeTime = $("#wakeTime").val();

		if ($("#checkWakeTime").is(':checked'))
		{
			if (wakeTime != '')
			{
				if ($.isNumeric(wakeTime))
				{
					writeResponse += "Wake Time (in ms): " + wakeTime + "<br>";
					return wakeTime;
				}
				else if (wakeTime < 69 || wakeTime > 3600000)
				{
					alert("Allowed values for wake time are from 69 - 3 600 000 ms only!");
					return;
				}
				else
				{
					alert("Please enter a numeric value for wake time!");
					return;
				}
			}
			else
			{
				alert("Please enter data for the wake time!");
				return;
			}
		}

		return '';
	}

	function getLedState()
	{
		var ledState = $("#ledState").val();

		if ($("#checkLedState").is(':checked'))
		{
			if (ledState == 'none')
			{
				alert("Please select LED state!");
				return;
			}
			else
			{
				writeResponse += "LED State: " + ledState + "<br>";
				return ledState;
			}
		}

		return '';
	}

	function getChangeRoute()
	{
		var fixed = $("#chFixed").val();
		var mult = $("#chMult").val();
		var score = $("#chScore").val();
		var dest = $("#chDest").val();
		var nextHop = $("#chNext").val();

		if ($("#changeRoute").is(':checked'))
		{
			if (fixed == "" || mult == "" || score == "" || dest == "" || nextHop == "")
			{
				alert("Please input complete parameters!");
				return;
			}
			else
			{
				params = fixed + " " + mult + " " + score + " " + dest + " " + nextHop;
				writeResponse += "Change route: " + params + "<br>"; 
				return params;
			}
		}

		return '';
	}

	function getRemoveRoute()
	{
		var dest = $("#rmDest").val();
		var mult = $("#rmMult").val();

		if ($("#removeRoute").is(':checked'))
		{
			if (mult == "" || dest == "")
			{
				alert("Please input complete parameters!");
				return;
			}
			else
			{
				params = dest + " " + mult;
				writeResponse += "Remove route: " + params + "<br>"; 
				return params;
			}
		}

		return '';
	}

	function readSleep()
	{
		if ($("#readSleepTime").is(':checked'))
		{
			return 1;
		}

		return 0;
	}

	function readSamp()
	{
		if ($("#readSampling").is(':checked'))
		{
			return 1;
		}

		return 0;
	}

	function readPower()
	{
		if ($("#readPower").is(':checked'))
		{
			return 1;
		}

		return 0;
	}

	function readLed()
	{
		if ($("#readLedState").is(':checked'))
		{
			return 1;
		}

		return 0;
	}

	function readSleep()
	{
		if ($("#readSleepTime").is(':checked'))
		{
			return 1;
		}

		return 0;
	}

	function readTHB()
	{
		if ($("#readTHB").is(':checked'))
		{
			return 1;
		}

		return 0;
	}

	function readTemp()
	{
		if ($("#readTemp").is(':checked'))
		{
			return 1;
		}

		return 0;
	}

	function readHum()
	{
		if ($("#readHumidity").is(':checked'))
		{
			return 1;
		}

		return 0;
	}

	function readBatt()
	{
		if ($("#readBattery").is(':checked'))
		{
			return 1;
		}

		return 0;
	}

	function readRoutingTable()
	{
		if ($("#routingTable").is(':checked'))
		{
			return 1;
		}

		return 0;
	}

	function readLqi()
	{
		var mult = $("#lqMult").val();
		var dest = $("#lqDest").val();

		if ($("#linkQuality").is(':checked'))
		{
			if (mult == "" || dest == "")
			{
				alert("Please input complete parameters!");
				return;
			}
			else
			{
				params = dest + " " + mult;
				return params;
			}
		}

		return '';
	}

	function readRstate()
	{
		var mult = $("#stateMult").val();
		var dest = $("#stateDest").val();

		if ($("#routingState").is(':checked'))
		{
			if (mult == "" || dest == "")
			{
				alert("Please input complete parameters!");
				return;
			}
			else
			{
				params = dest + " " + mult;
				return params;
			}
		}

		return '';
	}

});
