*
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


function updateClock(calendar){
	var dateTime = getDateTime('Now', planet.calendar);
	
	var c = document.getElementById("clock_"+calendar);
	var canvasWidth = c.width;
	var canvasHeight = c.height;
	
	var hubX = canvasWidth/2.0;
	var hubY = canvasWidth/2.0;	
	
	//draw the clock face
	var faceRadius = hubX*0.95;
	ctx.fillStyle = '#ffffff';
	
	ctx.beginPath();
	ctx.arc(hubX, hubY, faceRadius, 0, 2 * Math.PI);
	ctx.fill();
	
	//draw the ticks ------------------------------------
	var innerTickRadius = hubX*0.8;
	var outerTickRadius = hubX*0.85;
	
	//draw the second ticks
	var secondStep = 2*Math.PI*calendar.secondsPerMinute;
	ctx.strokeStyle = '#888888';
	
	for(let i=0; i<calendar.secondsPerMinute; i++)
	{
		var tickAngle = i* secondStep;
		
		var tickCos = Math.cos(tickAngle);
		var tickSin = Math.sin(tickAngle);
		
		ctx.beginPath();
		ctx.moveTo(hubX+tickCos*innerTickRadius,
				   hubY+tickSin*innerTickRadius);
		ctx.lineTo(hubX+tickCos*outerTickRadius,
				   hubY+tickSin*outerTickRadius);
		ctx.stroke();		   
	}
	
	
	//draw the minute ticks
	var minuteStep = 2*Math.PI*calendar.minutesPerHour;
	ctx.strokeStyle = '#444444';
	
	for(let i=0; i<calendar.minutesPerHour; i++)
	{
		var tickAngle = i* minuteStep;
		
		var tickCos = Math.cos(tickAngle);
		var tickSin = Math.sin(tickAngle);
		
		ctx.beginPath();
		ctx.moveTo(hubX+tickCos*innerTickRadius,
				   hubY+tickSin*innerTickRadius);
		ctx.lineTo(hubX+tickCos*outerTickRadius,
				   hubY+tickSin*outerTickRadius);
		ctx.stroke();		   
	}
		
	
	//draw the hour ticks
	var hourStep = 2*Math.PI*calendar.locHoursPerDay;
	ctx.strokeStyle = '#222222';
	
	for(let i=0; i<calendar.locHoursPerDay; i++)
	{
		var tickAngle = i* hourStep;
		
		var tickCos = Math.cos(tickAngle);
		var tickSin = Math.sin(tickAngle);
		
		ctx.beginPath();
		ctx.moveTo(hubX+tickCos*innerTickRadius,
				   hubY+tickSin*innerTickRadius);
		ctx.lineTo(hubX+tickCos*outerTickRadius,
				   hubY+tickSin*outerTickRadius);
		ctx.stroke();		   
	}
	
	
	//draw the hub
	var hubRadius = hubX*0.05;
	ctx.fillStyle = '#000000';
	
	ctx.beginPath();
	ctx.arc(hubX, hubY, hubRadius, 0, 2 * Math.PI);
	ctx.fill();
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
	if(animator == undefined)
	{
		animatedClock = calendar;
		clockAnimator = setInterval(advanceClock, 20);
	}
}

function stopClock()
{
	if(clockAnimator != undefined)
	{
		clearInterval(animator);
		clockAnimator = undefined;
	}
}