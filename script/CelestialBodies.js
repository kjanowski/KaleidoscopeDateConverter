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


var animator = undefined;
var animatorCalendar = 'utd';

var star = undefined;

function loadCelestialConfig(calendarConfigURL, celestialConfigURL){
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			initCalendars(this.responseText);
			loadStarSystem(celestialConfigURL);
		}
	};
	xmlhttp.open("GET", calendarConfigURL, true);
	xmlhttp.send();
}


function loadStarSystem(celestialConfigURL){
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			initStarSystem(this.responseText);
		}
	};
	xmlhttp.open("GET", celestialConfigURL, true);
	xmlhttp.send();
}


function initStarSystem(json){
	console.log("star system: "+json);
	
	star = JSON.parse(json);
	for(planet of star.planets)
	{	
		var planetCalendar = getCalendar(planet.calendar);		
		planet.orbitOffset = planet.orbitDayOffset / planetCalendar.daysPerYear;
		
		for(moon of planet.moons)
			moon.orbitOffset = moon.orbitDayOffset / moon.orbitDays;
	}
	
	console.log("loaded star with "+star.planets.length+" planets");
	updateStarSystem();
}

function getPlanetTransform(dateTime, planet)
{
	var orbitAngle = -(dateTime.yearFraction + planet.orbitOffset)*2.0*Math.PI; 
	var rotationAngle = -dateTime.dayFraction*2.0*Math.PI;
	var relRotationAngle = orbitAngle +rotationAngle;
	
	var orbitX = Math.cos(orbitAngle);
	var orbitY = Math.sin(orbitAngle);
	var orbitVX = orbitX*planet.visualDistance;
	var orbitVY = orbitY*planet.visualDistance;
	
	var transform = {
		orbitVisualX: orbitVX,
		orbitVisualY: orbitVY,
		orbitAngle: orbitAngle,
		relAngle: relRotationAngle
	};
	
	return transform;
}

function getMoonTransform(dateTime, calParams, planetOrbitAngle, moon)
{
	var orbitAngle = (moon.orbitOffset-(dateTime.totalDays / moon.orbitDays))*2.0*Math.PI; 
	orbitAngle = orbitAngle+planetOrbitAngle;
	
	var orbitX = Math.cos(orbitAngle);
	var orbitY = Math.sin(orbitAngle);
	var orbitVX = orbitX*moon.visualDistance;
	var orbitVY = orbitY*moon.visualDistance;
	
	var transform = {
		orbitVisualX: orbitVX,
		orbitVisualY: orbitVY
	};
	
	return transform;
}

function drawCelestialBody(ctx, centerX, centerY, celestial)
{
	ctx.fillStyle = celestial.color;
	
	ctx.beginPath();
	ctx.arc(centerX, centerY, celestial.radius, 0, 2 * Math.PI);
	ctx.fill();
	
	ctx.fillStyle = "#FFFFFF";
	fontY = centerY + celestial.radius + 20;
	ctx.fillText(centerX, fontY, celestial.name);
}



function drawPlanet(ctx, originX, originY, planet){
	var dateTime = getDateTime('Now', planet.calendar);
	var transform = getPlanetTransform(dateTime, planet);
	
	var centerX =  originX + transform.orbitVisualX;
	var centerY = originY + transform.orbitVisualY;
	
	drawCelestialBody(ctx, centerX, centerY, planet);
	
	for(marker of planet.markers)
	{
		drawMarker(ctx, centerX, centerY, marker, transform.relAngle, planet.radius);
	}
	
	for (moon of planet.moons){
		drawOrbit(ctx, centerX, centerY, moon);
		
		var planetCalendar = getCalendar(planet.calendar);
		var moonTransform = getMoonTransform(dateTime, planetCalendar, transform.orbitAngle, moon);
		var moonX = centerX + moonTransform.orbitVisualX;
		var moonY = centerY + moonTransform.orbitVisualY;

		drawCelestialBody(ctx, moonX, moonY, moon);
	}
	
	drawRing(ctx, centerX, centerY, planet);
}

function drawMarker(ctx, centerX, centerY, marker, relAngle, radius)
{
	var arrowWidth = 0.75;
	var arrowInnerRadius = radius * 0.3;
	var arrowOuterRadius = radius * 0.9;
		
	var markCenterRad = relAngle + marker.angle;
	var markStartRad = markCenterRad - arrowWidth;
	var markEndRad = markCenterRad + arrowWidth;
				
	ctx.fillStyle = marker.color;
		
	ctx.beginPath();	
	ctx.moveTo(centerX+(Math.cos(markStartRad)*arrowInnerRadius),
			   centerY+(Math.sin(markStartRad)*arrowInnerRadius));
	ctx.lineTo(centerX+(Math.cos(markCenterRad)*arrowOuterRadius),
			   centerY+(Math.sin(markCenterRad)*arrowOuterRadius));
	ctx.lineTo(centerX+(Math.cos(markEndRad)*arrowInnerRadius),
			   centerY+(Math.sin(markEndRad)*arrowInnerRadius)); 
	ctx.closePath();
	ctx.fill();	
}

function drawOrbit(ctx, originX, originY, celestial)
{
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.arc(originX, originY, celestial.visualDistance, 0, 2 * Math.PI);
	ctx.stroke();
}

function drawRing(ctx, centerX, centerY, planet)
{
	if(planet.ring != undefined){
		ctx.lineWidth = planet.ring.thickness;
		ctx.strokeStyle = planet.ring.color;
		
		ctx.beginPath();
		ctx.arc(centerX, centerY, planet.ring.radius, 0, 2 * Math.PI);
		ctx.stroke();
	}
}

function updateStarSystem(){
	var c = document.getElementById("starSystem");
	var canvasWidth = c.width;
	var canvasHeight = c.height;
	
	var ctx = c.getContext("2d");
	
	ctx.fillStyle="#000000";
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	
	ctx.strokeStyle = "#FFFFFF";
	ctx.font = '16px Oregano';

	var originX = canvasWidth/2;
	var originY = canvasHeight/2;
	
	drawCelestialBody(ctx, originX, originY, star);
	
	for(planet of star.planets)
	{
		drawOrbit(ctx, originX, originY, planet);
		drawPlanet(ctx, originX, originY, planet);
	}
}

function toggleAnimation(calendar)
{
	var btn = document.getElementById("toggleAnim")
	if(animator == undefined)
	{
		animatorCalendar = calendar;
		animator = setInterval(advanceTime, 20);
		btn.innerHTML = "||";
	}else{
		clearInterval(animator);
		animator = undefined;
		btn.innerHTML = "►";
	}
}


function advanceTime() {
	var calendar= getCalendar(animatorCalendar);
	var timeStep = calendar.minutesPerHour*calendar.secondsPerMinute;

	times['Now'] = times['Now'] + timeStep;

	updateAllInputs('Now');
	updateStarSystem();
}













