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
	
	var hubX = canvasWidth/2.0;
	var hubY = canvasWidth/2.0;	
	
	
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

	
	//draw the hands -------------------------------------
	var hubRadius = hubX*0.05;
	
	clockSVG.innerHTML = clockSVG.innerHTML + 
		createHand("hourHand", 10, hubRadius, innerTickRadius, "black");
	clockSVG.innerHTML = clockSVG.innerHTML + 
		createHand("minuteHand", 10, hubRadius, innerTickRadius, "gray");
	clockSVG.innerHTML = clockSVG.innerHTML + 
		createHand("secondHand", 10, hubRadius, innerTickRadius, "lightGray");
	
	//draw the hub
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

function createHand(id, hubX, hubY, thickness, innerRadius, outerRadius, color)
{
	var svgElement = "<line id=\""+id
				+"\" x1=\""+hubX
				+"\" y1=\""+hubY+innerRadius
				+"\" x2=\""+hubX
				+"\" y2=\""+hubY+outerRadius
				+"\" style=\"stroke:\""+color+";stroke-width:\""+thickness+"\"/>";	
	
	return svgElement;
}

function updateClock(calendar){
	var dateTime = getDateTime('Now', calendar);
	
	//todo move the hands
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