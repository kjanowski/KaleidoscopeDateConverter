var star = {};
star.name = "Saphéne";
star.color = "#FFFF88";
star.radius= 20;
star.numPlanets = 0;
star.planets = [];


planet_1 = {};
planet_1.name="Chryphóra";
planet_1.color = "#88FFFF";
planet_1.radius = 10;
planet_1.calendar = "nimyric";
planet_1.orbitDayOffset = -37;
planet_1.visualDistance = 100; //pixels
planet_1.realDistance = 143728579.0; //km, to be used for full version later
planet_1.poiColor = "#004EFF";


star.planets.push(planet_1);
star.numPlanets += 1;