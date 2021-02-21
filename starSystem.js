var animator = undefined;

function initStarSystem(){
	for(planet of star.planets)
	{
		planet.orbitOffset = planet.orbitDayOffset / params[planet.calendar].daysPerYear;
		
		for(moon of planet.moons)
			moon.orbitOffset = moon.orbitDayOffset / moon.orbitDays;
	}
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
		relAngle: relRotationAngle
	};
	
	return transform;
}

function getMoonTransform(dateTime, moon)
{
	var orbitAngle = -((dateTime.totalDays / moon.orbitDays)+moon.orbitOffset)*2.0*Math.PI; 
	
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
	
	//draw POI
	var arrowWidth = 0.75;
	var arrowInnerRadius = planet.radius * 0.3;
	var arrowOuterRadius = planet.radius * 0.9;
		
	var poiCenterRad = transform.relAngle;
	var poiStartRad = poiCenterRad - arrowWidth;
	var poiEndRad = poiCenterRad + arrowWidth;
				
	ctx.fillStyle = planet.poiColor;
		
	ctx.beginPath();	
	ctx.moveTo(centerX+(Math.cos(poiStartRad)*arrowInnerRadius),
			   centerY+(Math.sin(poiStartRad)*arrowInnerRadius));
	ctx.lineTo(centerX+(Math.cos(poiCenterRad)*arrowOuterRadius),
			   centerY+(Math.sin(poiCenterRad)*arrowOuterRadius));
	ctx.lineTo(centerX+(Math.cos(poiEndRad)*arrowInnerRadius),
			   centerY+(Math.sin(poiEndRad)*arrowInnerRadius)); 
	ctx.closePath();
	ctx.fill();
	
	
	for (moon of planet.moons){
		drawOrbit(ctx, centerX, centerY, moon);
		
		var moonTransform = getMoonTransform(dateTime, moon);
		var moonX = centerX + moonTransform.orbitVisualX;
		var moonY = centerY + moonTransform.orbitVisualY;

		drawCelestialBody(ctx, moonX, moonY, moon);
	}
}

function drawOrbit(ctx, originX, originY, celestial)
{
	ctx.beginPath();
	ctx.arc(originX, originY, celestial.visualDistance, 0, 2 * Math.PI);
	ctx.stroke();
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
	drawOrbit(ctx, originX, originY, star.planets[0]);
	
	drawPlanet(ctx, originX, originY, star.planets[0]);
}

function toggleAnimation()
{
	var btn = document.getElementById("toggleAnim")
	if(animator == undefined)
	{
		animator = setInterval(advanceTime, 20);
		btn.innerHTML = "||";
	}else{
		clearInterval(animator);
		animator = undefined;
		btn.innerHTML = "►";
	}
}


function advanceTime() {
	var calendarParams=params[star.planets[0].calendar];
	var timeStep = calendarParams.minutesPerHour*calendarParams.secondsPerMinute;

	times['Now'] = times['Now'] + timeStep;

	updateInputs('Now', star.planets[0].calendar);
	updateStarSystem();
}













