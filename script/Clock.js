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


function createClock(calendar)
{
	var clockSVG = document.getElementById("clock_"+calendar);
	
	var hubX = clockSVG.getAttribute("width")/2.0;
	var hubY = clockSVG.getAttribute("height")/2.0;	
	
	
	//create the clock face
	var faceRadius = hubX*0.95;
	
	//create the clock face
	clockSVG.innerHTML =
		"<circle cx=\""+hubX+"\" cy=\""+hubY+"\" r=\""+faceRadius+"\" fill=\"white\"/>";	
	
	
	//draw the ticks ------------------------------------
	var innerTickRadius = hubX*0.8;
	var outerTickRadius = hubX*0.85;
	
	//draw the second ticks
	clockSVG.innerHTML = clockSVG.innerHTML +
		createTicks("secondTicks", calendar.secondsPerMinute,
					innerTickRadius, outerTickRadius, "lightGray");	

	//draw the minutes ticks
	clockSVG.innerHTML = clockSVG.innerHTML +
		createTicks("minuteTicks", calendar.minutesPerHour,
					innerTickRadius, outerTickRadius, "gray");	

	//draw the hour ticks
	clockSVG.innerHTML = clockSVG.innerHTML +
		createTicks("hourTicks", calendar.locHoursPerDay,
					innerTickRadius, outerTickRadius, "black");	

	
	//prepare the hands -------------------------------------
	clockSVG.innerHTML = clockSVG.innerHTML + "<g id=\"hands_"+calendar+"\"></g>"; 
		
	//draw the hub
	var hubRadius = hubX*0.05;
	clockSVG.innerHTML = clockSVG.innerHTML +
		"<circle cx=\""+hubX+"\" cy=\""+hubY+"\" r=\""+hubRadius+"\" fill=\"black\"/>";	
}

function createTicks(id, hubX, hubY, tickCount, innerTickRadius, outerTickRadius, color)
{
	var svgElement = "<g id=\""+id+"\">";	

	var secondStep = 2*Math.PI*tickCount;
	
	for(let i=0; i<tickCount; i++)
	{
		var tickAngle = i* secondStep;
		
		var tickCos = Math.cos(tickAngle);
		var tickSin = Math.sin(tickAngle);
		svgElement = svgElement +
			"<line x1=\""+(hubX+tickCos*innerTickRadius)
				+"\" y1=\""+(hubY+tickSin*innerTickRadius)
				+"\" x2=\""+(hubX+tickCos*outerTickRadius)
				+"\" y2=\""+(hubY+tickSin*outerTickRadius)
				+"\" stroke=\""+color+"\"/>";	
	}
	
	svgElement = svgElement + "</g>";
	
	return svgElement;
}

function createHand(id, count, hubX, hubY, thickness, innerRadius, outerRadius, color)
{
	var angle = 2*Math.PI*count;
	
	var handCos = Math.cos(angle);
	var handSin = Math.sin(angle);
	
	
	var svgElement = "<line id=\""+id
				+"\" x1=\""+hubX+handCos*innerRadius
				+"\" y1=\""+hubY+handSin*innerRadius
				+"\" x2=\""+hubX+handCos*outerRadius
				+"\" y2=\""+hubY+handSin*outerRadius
				+"\" style=\"stroke:\""+color+";stroke-width:\""+thickness+"\"/>";	
	
	return svgElement;
}

function updateClock(calendar){
	var dateTime = getDateTime('Now', calendar);
	
	//draw the hands
	var clockSVG = document.getElementById("clock_"+calendar);
	var handsGroup = document.getElementById("hands_"+calendar);
	
	var hubX = clockSVG.width/2.0;
	var hubY = clockSVG.height/2.0;
	
	var innerRadius = hubX*0.025;
	var hourRadius = hubX*0.5;
	var minuteRadius = hubX*0.75;
	var secondRadius = hubX*0.95;
	
	var hands = createHand("hourHand", dateTime.hour, 10, innerRadius, hourRadius, "black");
	hands = hands + 
		createHand("minuteHand", dateTime.minute, 10, innerRadius, minuteRadius, "gray");
	hands = hands + 
		createHand("secondHand", dateTime.second, 10, innerRadius, secondRadius, "lightGray");
	
	handsGroup.innerHTML = hands;
}


function advanceClock(){
	var calendar= getCalendar(animatedClock);
	var timeStep = 0.02 * (calendar.minutesPerHour*calendar.secondsPerMinute)
						/ (3600.0);

	times['Now'] = times['Now'] + timeStep;

	updateAllInputs('Now');
	updateClock(calendar);
}


function startClock(calendar)
{
	if(clockAnimator == undefined)
	{
		animatedClock = calendar;
		clockAnimator = setInterval(advanceClock, 20);
	}
	
	createClock();
}

function stopClock()
{
	if(clockAnimator != undefined)
	{
		clearInterval(animator);
		clockAnimator = undefined;
	}
}