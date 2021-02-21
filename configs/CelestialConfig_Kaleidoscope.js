/*
	Copyright Kathrin Janowski (https://www.kathrinjanowski.com/en/home), 2020-2021.
  
	This file contains the worldbuilding parameters which are NOT covered by the GPLv3 License.
	You may not use this file directly, but you can reference it for creating your own configuration script.
	
	Further details can be found in the file "readme.md" in the root folder.
*/

var star = {};
star.name = "Saphéne";
star.color = "#FFFF88";
star.radius= 20;
star.numPlanets = 0;
star.planets = [];


planet_1 = {};
planet_1.color = "#88FFFF";
planet_1.radius = 10;
planet_1.calendar = "nimyric";
planet_1.orbitDayOffset = -37;
planet_1.visualDistance = 100; //pixels
planet_1.poiColor = "#004EFF";
planet_1.moons=[
		{
			color: "#CCCCCC",
			radius: 5,
			visualDistance: 30,
			orbitDays: 25,
			orbitDayOffset: 3
		}
	];



star.planets.push(planet_1);
star.numPlanets += 1;