/*
	Copyright Kathrin Janowski (https://www.kathrinjanowski.com/en/home), 2020-2021.
  
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

var clockAnimator = undefined;
var animatedClock = undefined;



function updateClock(calendarName)
{
	var calendar = getCalendar(calendarName);
	var clockSVG = document.getElementById("clock_"+calendarName);
	
	var hubX = clockSVG.getAttribute("width")/2.0;
	var hubY = clockSVG.getAttribute("height")/2.0;	
	var radius = Math.min(hubX, hubY);
	
	//create the clock face
	var faceRadius = radius*0.95;
	
	//create the clock face
	clockSVG.innerHTML =
		"<circle cx=\""+hubX+"\" cy=\""+hubY+"\" r=\""+faceRadius+"\" fill=\"white\"/>";	
	
	
	//draw the ticks ------------------------------------
	var innerTickRadius = radius*0.8;
	var outerTickRadius = radius*0.85;
	
	//draw the second ticks
	clockSVG.innerHTML = clockSVG.innerHTML +
		createTicks("secondTicks", hubX, hubY, calendar.secondsPerMinute,
					innerTickRadius, outerTickRadius, "lightGray");	

	//draw the minutes ticks
	clockSVG.innerHTML = clockSVG.innerHTML +
		createTicks("minuteTicks", hubX, hubY, calendar.minutesPerHour,
					innerTickRadius, outerTickRadius, "gray");	

	//draw the hour ticks
	clockSVG.innerHTML = clockSVG.innerHTML +
		createTicks("hourTicks", hubX, hubY, calendar.locHoursPerDay,
					innerTickRadius, outerTickRadius, "black");	

	
	//prepare the hands -------------------------------------
	clockSVG.innerHTML = clockSVG.innerHTML + createHands(hubX, hubY, calendarName); 
		
	//draw the hub
	var hubRadius = radius*0.05;
	clockSVG.innerHTML = clockSVG.innerHTML +
		"<circle cx=\""+hubX+"\" cy=\""+hubY+"\" r=\""+hubRadius+"\" fill=\"black\"/>";	
}

function createTicks(id, hubX, hubY, tickCount, innerRadius, outerRadius, color)
{
	var svgElement = "<g id=\""+id+"\">";	

	var secondStep = 2*Math.PI*tickCount;
	
	for(let i=0; i<tickCount; i++)
	{
		var tickAngle = i* secondStep;
		
		var tickCos = Math.cos(tickAngle);
		var tickSin = Math.sin(tickAngle);
		
		var startX = hubX+tickCos*innerRadius;
		var startY = hubY+tickSin*innerRadius;
		var endX = hubX+tickCos*outerRadius;
		var endY = hubY+tickSin*outerRadius;
	
		svgElement = svgElement +
			"<line x1=\""+startX
				+"\" y1=\""+startY
				+"\" x2=\""+endX
				+"\" y2=\""+endY
				+"\" stroke=\""+color+"\"/>";	
	}
	
	svgElement = svgElement + "</g>";
	
	return svgElement;
}

function createHand(id, calendar, count, maxCount, hubX, hubY, thickness, innerRadius, outerRadius, color)
{
	var angle = 2*Math.PI*count/maxCount;
	
	var handCos = Math.cos(angle);
	var handSin = Math.sin(angle);
	
	var startX = hubX+handCos*innerRadius;
	var startY = hubY+handSin*innerRadius;
	var endX = hubX+handCos*outerRadius;
	var endY = hubY+handSin*outerRadius;
	
	var svgElement = "<line id=\""+id+"\" x1=\""+startX+"\" y1=\""+startY
				+"\" x2=\""+endX+"\" y2=\""+endY+"\" style=\"stroke:"+color+";stroke-width:"+thickness+"/>";	
	
	return svgElement;
}

function createHands(hubX, hubY, calendarName){
	console.log("updating clock \""+calendarName+"\"");
	
	
	var dateTime = getDateTime('Now', calendarName);
	var calendar = getCalendar(calendarName);
	
	//draw the hands
	var radius = Math.min(hubX, hubY);
	
	var innerRadius = radius*0.025;
	var hourRadius = radius*0.5;
	var minuteRadius = radius*0.75;
	var secondRadius = radius*0.95;
	
	var hands = 
		createHand("hourHand", dateTime.hour, calendar.locHoursPerDay, hubX, hubY, 10, innerRadius, hourRadius, "black");
	hands = hands + 
		createHand("minuteHand", dateTime.minute, calendar.minutesPerHour, hubX, hubY, 10, innerRadius, minuteRadius, "gray");
	hands = hands + 
		createHand("secondHand", dateTime.second, calendar.secondsPerMinute, hubX, hubY, 10, innerRadius, secondRadius, "lightGray");
	
	return hands;
}


function advanceClock(){
	var calendar = getCalendar(animatedClock);
	var timeStep = 0.02 * (calendar.minutesPerHour*calendar.secondsPerMinute)
						/ (3600.0);

	times['Now'] = times['Now'] + timeStep;

	updateAllInputs('Now');
	updateClock(animatedClock);
}


function toggleClock(calendar)
{
	var btn = document.getElementById("toggleClock")
	
	if(clockAnimator == undefined)
	{
		animatedClock = calendar;
		clockAnimator = setInterval(advanceClock, 20);
		btn.innerHTML = "||";
	}else
	{
		clearInterval(clockAnimator);
		clockAnimator = undefined;
		btn.innerHTML = "►";
	}
}