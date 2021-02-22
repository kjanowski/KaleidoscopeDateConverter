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
		color: "#FFFFBB",
		radius: 4,
		calendar: "twk",
		orbitDayOffset: 77,
		visualDistance: 100,
		markers:[
			{
				angle:0.0,
				color:"#8800FF"
			}
		],
		moons:[],
		ring:[]
	}
];
