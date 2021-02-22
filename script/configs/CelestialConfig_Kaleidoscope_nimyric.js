/*
	Copyright Kathrin Janowski (https://www.kathrinjanowski.com/en/home), 2020-2021.
  
	This file contains the worldbuilding parameters which are NOT covered by the GPLv3 License.
	You may not use this file directly, but you can reference it for creating your own configuration script.
	
	Further details can be found in the file "readme.md" in the root folder.
*/

var star = {};
star.color = "#FFFF88";
star.radius= 20;
star.planets = [
	{	
		color: "#88FFFF",
		radius: 12,
		calendar: "nimyric",
		orbitDayOffset: -37,
		visualDistance: 100,
		markers:[
			{
				angle: 0.0,
				color: "#004EFF"
			}
		],
		moons:[
			{
				color: "#CCCCCC",
				radius: 3,
				visualDistance: 30,
				orbitDays: 25,
				orbitDayOffset: 1
			}
		],
		ring:undefined
	}
];
