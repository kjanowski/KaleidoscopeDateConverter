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


//====================================================================
// init global variables
//====================================================================

var times = {}
times["Now"] = 0.0;
times["Then"] = 0.0;

//
// You also need to include a configuration .js file in your HTML before executing anything here.
//

function initParams(){
	console.log (params);
	
	var offsetFactor = params["utd"].daysPerYear*params["utd"].stdHoursPerDay*params["utd"].minutesPerHour*params["utd"].secondsPerMinute;

	for(calendar of calendarNames)
	{
		if(calendar != 'utd')
			params[calendar].offsetUTD = params[calendar].rawOffsetUTD*offsetFactor;
	}
}

//=================================================================
// calculating time
//=================================================================


function setDateTime(which, calendar, year, month, day, hour, minute, second){
	
	var after = (year >= 0);
		
	//add up the days for all years until now
	var localDays = year*params[calendar].daysPerYear;
		
	//add the past months of the current year
	var m=1;
	while(m<month)
	{
		localDays = localDays + params[calendar].monthLength[m-1];
		m++;
	}
	
	//add the past days of the current month
	localDays = localDays + day-1;
	
	//convert to seconds --------------------------------------- 
	
	//days -> hours
	var localHours = localDays * params[calendar].locHoursPerDay;
	//add current hour
	localHours = localHours + hour;
	
	//hours -> minutes
	var localMinutes = localHours * params[calendar].minutesPerHour;
	//add current minute
	localMinutes = localMinutes + minute;
	
	//minutes -> seconds
	var localSeconds = localMinutes * params[calendar].secondsPerMinute;
	//add current second
	localSeconds = localSeconds + second;
	
	//convert to standard seconds -------------------------------
	
	var standardSeconds = localSeconds
						/ params[calendar].secondsPerMinute //current value: local minutes
						/ params[calendar].minutesPerHour //current value: local hours
						/ params[calendar].locHoursPerDay //current value: local days
						* params[calendar].stdHoursPerDay //current value: standard hours
						* params["utd"].minutesPerHour    //current value: standard minutes
						* params["utd"].secondsPerMinute; //current value: standard seconds
	
	//shift relative to standard time ---------------------------
	
	times[which] = standardSeconds + params[calendar].offsetUTD;
}




function getDateTime(which, calendar)
{
	var standardSeconds = times[which] - params[calendar].offsetUTD;
	return getConvertedTime(calendar, standardSeconds);
}


function getDeltaTime(calendar)
{
	var deltaStdSec = Math.abs(times["Now"] - times["Then"]);
	return getConvertedTime(calendar, deltaStdSec);
}


function getConvertedTime(calendar, standardSeconds){
	var after = (standardSeconds >= 0);
	
	//convert to local seconds ----------------------------------
	
	var localSeconds = standardSeconds
					 / params["utd"].secondsPerMinute //standard minutes
					 / params["utd"].minutesPerHour   //standard hours
					 / params[calendar].stdHoursPerDay //local days
					 * params[calendar].locHoursPerDay //local hours
					 * params[calendar].minutesPerHour //local minutes
					 * params[calendar].secondsPerMinute; //local seconds
	
	if(!after)
		localSeconds = localSeconds + 1;
	
	var second = localSeconds % params[calendar].secondsPerMinute;
	
	
	var localMinutes = (localSeconds - second)/params[calendar].secondsPerMinute;
	if(!after)
	{
		//complement
		second = params[calendar].secondsPerMinute + second -1;
	}
	second = Math.floor(second);
	
	var minute = localMinutes % params[calendar].minutesPerHour;
	
	var localHours = (localMinutes - minute)/params[calendar].minutesPerHour;
	if(!after)
	{
		//complement
		minute = params[calendar].minutesPerHour + minute -1;
	}
	
	var hour = localHours % params[calendar].locHoursPerDay;
	//console.log("["+calendar+"] hours:"+hour);
	var localDays = (localHours - hour)/params[calendar].locHoursPerDay;
	if(!after)
	{
		//complement
		hour = params[calendar].locHoursPerDay + hour -1;
	}
	
	//extract the date -------------------------------------------
	
	var localYearDays;
	var localYear;
	if(after)
	{
		localYearDays = localDays % params[calendar].daysPerYear +1;
		localYear = Math.floor(localDays/params[calendar].daysPerYear);
	}
	else
	{
		localDays = -localDays;
		localYear = Math.floor(localDays/params[calendar].daysPerYear) +1;
		localYearDays = params[calendar].daysPerYear
							 - (localDays - (localYear-1)*params[calendar].daysPerYear);
	}
	
	

	//--------------------------------------------------
	var day;
	var month=0;
	var monthName="";
	var year;

	day = localYearDays;
	year = localYear;
	
	
	//extract the month, if it's not the leap month
	var m = 0;
	while((m<params[calendar].monthNames.length) && (monthName==""))
	{
		if (day <= params[calendar].monthLength[m])
		{
			monthName = params[calendar].monthNames[m];
			month = m+1;
		}else{
			day = day - params[calendar].monthLength[m];
			m = m+1;
		}
		
	}
	
	
	var era;
	var eraIndex;
	if(after)
	{
		era = params[calendar].eraAfter;
		eraIndex=1;
	}
	else{
		era = params[calendar].eraBefore;
		eraIndex=0;
	}
	
	var yearFraction = localYearDays/params[calendar].daysPerYear;
	var dayFraction = (hour + (minute/params[calendar].minutesPerHour)
						   + (second/(params[calendar].secondsPerMinute*params[calendar].minutesPerHour)))
							/ params[calendar].locHoursPerDay;
	
	var dateTime = {
		year: year,
		eraIndex: eraIndex,
		era: era,
		month: month,
		monthName: monthName,
		totalDays : localDays,
		day: day,
		hour: hour,
		minute: minute,
		second: second,
		yearFraction: yearFraction,
		dayFraction: dayFraction
	};
	
	return dateTime;
}

function getTimeText(dateTime)
{
	var text = ""+dateTime.hour+":";
	if(dateTime.minute < 10)
		text = text+"0";
	text = text +dateTime.minute+":";
	if(dateTime.second < 10)
		text = text+"0";
	text = text +dateTime.second;			

	return text;
}

function updateDisplay(calendar){
	var dateTimeNow = getDateTime("Now", calendar);
	
	var textNow = "<h3>Current time:</h3>"
					+dateTimeNow.year+" "+dateTimeNow.era+"<br>"
					+"<div class=\"tooltip\">"+dateTimeNow.monthName
						+"<div class=\"tooltip-text\">"
							+dateTimeNow.month+"</div></div> "
					+dateTimeNow.day+"<br>"+getTimeText(dateTimeNow);
	document.getElementById("output-"+calendar+"-now").innerHTML = textNow;
								
	var dateTimeThen = getDateTime("Then", calendar);
	
	var timeThen = ""+dateTimeThen.hour+":";
	if(dateTimeThen.minute < 10)
		timeThen = timeThen+"0";
	timeThen = timeThen +dateTimeThen.minute+":";
	if(dateTimeThen.second < 10)
		timeThen = timeThen+"0";
	timeThen = timeThen +dateTimeThen.second;			
	
	var textThen = "<h3>Comparison time:</h3>"
					+dateTimeThen.year+" "+dateTimeThen.era+"<br>"
					+"<div class=\"tooltip\">"+dateTimeThen.monthName
						+"<div class=\"tooltip-text\">"
							+dateTimeThen.month+"</div></div> "
					+dateTimeThen.day+"<br>"+getTimeText(dateTimeThen);	
	document.getElementById("output-"+calendar+"-then").innerHTML = textThen;

	var deltaTime = getDeltaTime(calendar);
	
	var timeDiff = ""+deltaTime.hour+":";
	if(deltaTime.minute < 10)
		timeDiff = timeDiff+"0";
	timeDiff = timeDiff +deltaTime.minute+":";
	if(deltaTime.second < 10)
		timeDiff = timeDiff+"0";
	timeDiff = timeDiff +deltaTime.second;			
	
	var textDiff = "<h3>Distance:</h3>"
					+deltaTime.year+" years, "+(deltaTime.month-1)+" months, "+(deltaTime.day-1)+" days,<br>"+getTimeText(deltaTime)
					+"<br>("+deltaTime.totalDays+" days total)"; 
	document.getElementById("output-"+calendar+"-diff").innerHTML = textDiff;
}

function setTime(which){
	//get the values and convert them to numbers
	var calendar = document.getElementById('calendar'+which).value;
	var year = document.getElementById('year'+which).value *1.0;
	var month = document.getElementById('month'+which).value *1.0;
	var day = document.getElementById('day'+which).value *1.0;
	var hour = document.getElementById('hour'+which).value *1.0;
	var minute = document.getElementById('minute'+which).value *1.0;
	var second = document.getElementById('second'+which).value *1.0;
	
	//set the date in the selected calendar
	setDateTime(which, calendar, year, month, day, hour, minute, second);

	for(name of calendarNames)
		updateDisplay(name);
}

function submitInputs(which, calendar){
	//get the values and convert them to numbers
	var year = document.getElementById('year_'+calendar).value *1.0;
	var eraIndex = document.getElementById('era_'+calendar).selectedIndex;
	if(eraIndex == 0)
		year = -year;
	
	var month = document.getElementById('month_'+calendar).value *1.0;
	var day = document.getElementById('day_'+calendar).value *1.0;
	var hour = document.getElementById('hour_'+calendar).value *1.0;
	var minute = document.getElementById('minute_'+calendar).value *1.0;
	var second = document.getElementById('second_'+calendar).value *1.0;
	
	//set the date in the selected calendar
	setDateTime('Now', calendar, year, month, day, hour, minute, second);
}

function limitInputs(calendar)
{
	var yearInput = document.getElementById('year_'+calendar);
	var era = document.getElementById('era_'+calendar).selectedIndex;
	if(era>0)
		yearInput.min = 0;
	else yearInput.min =1;
	yearInput.value = Math.max(yearInput.value, yearInput.min);
	
	
	var dayInput = document.getElementById('day_'+calendar);
	var month = document.getElementById('month_'+calendar).value * 1 - 1;
	dayInput.max = params[calendar].monthLength[month];
	dayInput.value = Math.min(dayInput.value, dayInput.max);
}

function updateInputs(which, calendar){
	var dateTime = getDateTime(which, calendar);
	
	document.getElementById('year_'+calendar).value = ""+dateTime.year;
	
	var eraDropdown = document.getElementById('era_'+calendar);
	eraDropdown.selectedIndex = dateTime.eraIndex;
	
		
	document.getElementById('month_'+calendar).value = ""+dateTime.month;
	document.getElementById('day_'+calendar).value = ""+dateTime.day;
	document.getElementById('hour_'+calendar).value = ""+dateTime.hour;
	document.getElementById('minute_'+calendar).value = ""+dateTime.minute;
	document.getElementById('second_'+calendar).value = ""+dateTime.second;
	
	limitInputs(calendar);
}