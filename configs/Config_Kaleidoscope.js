/*
	Copyright Kathrin Janowski (https://www.kathrinjanowski.com/en/home), 2020-2021.
  
	This file contains the worldbuilding parameters which are NOT covered by the GPLv3 License.
	You may not use this file directly, but you can reference it for creating your own configuration script.
	
	Further details can be found in the file "readme.md" in the root folder.
*/

var calendarNames = ["utd", "nimyric", "pereqaian", "rilsu", "twk"];

var params = {}

params["utd"] = {}
params["utd"].name = "UTD";
params["utd"].secondsPerMinute = 60.0;
params["utd"].minutesPerHour = 60.0;
params["utd"].locHoursPerDay = 24.0;
params["utd"].stdHoursPerDay = 24.0;
params["utd"].daysPerYear = 365.0;
params["utd"].monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
params["utd"].monthLength =[31, 28, 31, 30, 31, 30,	31, 31, 30, 31, 30, 31];
params["utd"].eraBefore = "before time began"
params["utd"].eraAfter = "since time began"
params["utd"].offsetUTD = 0.0;

params["nimyric"] = {}
params["nimyric"].name = "Nimýric Empire";
params["nimyric"].secondsPerMinute = 60.0;
params["nimyric"].minutesPerHour = 60.0;
params["nimyric"].locHoursPerDay = 30.0;
params["nimyric"].stdHoursPerDay = 30.0;
params["nimyric"].monthNames = ["Córélun","Aolun","Lahalun","Chychlun","Chynlun","Dapolun","Hémélun",
					  "Dyntélun","Miblun","Uklun","Vésólun","Matcylun","Roklun","Murilun"];
params["nimyric"].monthLength = [24,25,25,25,25,25,25,24,25,25,25,25,25,25];
params["nimyric"].daysPerYear=348.0;
params["nimyric"].eraBefore = "NN"
params["nimyric"].eraAfter = "PN"
params["nimyric"].rawOffsetUTD = 287345.12537;

params["pereqaian"] = {}
params["pereqaian"].name="Pereqaian Alliance";
params["pereqaian"].secondsPerMinute = 60.0;
params["pereqaian"].minutesPerHour = 60.0;
params["pereqaian"].locHoursPerDay = 30.0;
params["pereqaian"].stdHoursPerDay = 30.0;
params["pereqaian"].monthNames = ["Mu Nèlisi", "Mu Niseqòn", "Mu Ozide", "Mu Sedùt", "Mu Qòtve",
							  "Mu Pêtve", "Mu Seshivèr", "Mu Nèlgofi", "Mu Shulòri", "Mu Renifi",
							  "Mu Qùshve", "Mu Nifhêqa", "Mu Fêfumish", "Mu Zêicen"];
params["pereqaian"].monthLength = [25,25,25,24,25,25,25,25,25,25,24,25,25,25];
params["pereqaian"].daysPerYear=348.0;
params["pereqaian"].eraBefore = "FGZ"
params["pereqaian"].eraAfter = "TGZ"
params["pereqaian"].rawOffsetUTD = 288552.6619;


params["rilsu"] = {};
params["rilsu"].name = "Rilsu World Republic";
params["rilsu"].secondsPerMinute = 64.0;
params["rilsu"].minutesPerHour = 64.0;
params["rilsu"].locHoursPerDay = 32.0;
params["rilsu"].stdHoursPerDay = 33.0;
params["rilsu"].monthNames = ["Sizonoma", "Tugrunoma", "Aminoma", "Guztinoma",
							  "Uvonoma", "Kolkanoma", "Sigifnoma", "Degmanoma",
							  "Sedunoma", "Pikanoma", "Akrunoma", "Keponoma", "Zadrunoma",
							  "Despinoma", "Hudrunoma", "Atrunoma", "Taprunoma"];
params["rilsu"].monthLength = [32,32,32,32,32,32,32,32,32,32,9,32,32,32,32,32,32];
params["rilsu"].daysPerYear = 521.0;
params["rilsu"].eraBefore = "NZR"
params["rilsu"].eraAfter = "VZR"
params["rilsu"].rawOffsetUTD = 287459.0931;


params["twk"] = {}
params["twk"].name = "The Hive";
params["twk"].secondsPerMinute = 50.0;
params["twk"].minutesPerHour = 80.0;
params["twk"].locHoursPerDay = 200.0;
params["twk"].stdHoursPerDay = 154.0;
params["twk"].monthNames = ["The Phase Formerly Known As The Phase Of Greatest Power",
						"The Phase Formerly Known As The Phase Of Waning Power",
						"The Phase Formerly Known As The Phase Of Power Loss",
						"The Phase Formerly Known As The Phase Of Waxing Power"];
params["twk"].monthLength = [50,50,55,50];
params["twk"].daysPerYear=205.0;
params["twk"].eraBefore = "Before The Hive"
params["twk"].eraAfter = "In The Hive"
params["twk"].rawOffsetUTD = 0.0;
