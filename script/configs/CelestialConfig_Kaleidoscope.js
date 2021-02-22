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
		color: "#888888",
		radius: 5,
		calendar: "achyu",
		orbitDayOffset: 0,
		visualDistance: 50,
		markers:[],
		moons:[],
		ring:undefined
	},
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
			},
			{
				angle: -2.0944,
				color: "#FF0000"
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
	},
	{	
		color: "#FFCC44",
		radius: 13,
		calendar: "rilsu",
		orbitDayOffset: -64,
		visualDistance: 190,
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
				orbitDayOffset: -12
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
	},
	{	
		color: "#66BBFF",
		radius: 14,
		calendar: "ivlare",
		orbitDayOffset: 67,
		visualDistance: 300,
		markers:[
			{
				angle:0.0,
				color:"#3366FF"
			}
		],
		moons:[],
		ring:{
			radius: 33,
			thickness: 10,
			color: "#AABBFF"
		}
	},
	{	
		color: "#FFFFBB",
		radius: 4,
		calendar: "twk",
		orbitDayOffset: 77,
		visualDistance: 370,
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
