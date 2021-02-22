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
		color: "#FFCC44",
		radius: 13,
		calendar: "rilsu",
		orbitDayOffset: -64,
		visualDistance: 100,
		markers:[
			{
				angle:0.0,
				color:"#FF8800"
			}
		],
		moons:[
			{
				color: "#FFAA88",
				radius: 4,
				visualDistance: 30,
				orbitDays: 32,
				orbitDayOffset: 9
			},
			{
				color: "#CCCCCC",
				radius: 2,
				visualDistance: 40,
				orbitDays: 57,
				orbitDayOffset: 0
			}
		],
		ring:undefined
	}
];
