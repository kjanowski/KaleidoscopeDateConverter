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

var calendarConfig = undefined;


function loadCalendarConfig(configURL){
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			initCalendars(this.responseText);
		}
	};
	xmlhttp.open("GET", configURL, true);
	xmlhttp.send();
}

function initCalendars(json){
	calendarConfig = JSON.parse(json);
	
	
	var utdCalendar = getCalendar("utd");
	
	var offsetFactor = utdCalendar.daysPerYear
					 * utdCalendar.stdHoursPerDay
					 * utdCalendar.minutesPerHour
					 * utdCalendar.secondsPerMinute;
	for(calendar of calendarConfig.params)
	{
		if(calendar.name != 'UTD')
			calendar.offsetUTD = calendar.rawOffsetUTD*offsetFactor;
		else calendar.offsetUTD = 0.0;
	}
}

function getCalendar(calendarName){
	var index = calendarConfig.calendarNames.indexOf(calendarName);
	var calendar = calendarConfig.params[index];
	return calendar;
}


//=================================================================
// calculating time
//=================================================================


function convertToStdSeconds(calendarName, year, month, day, hour, minute, second){
	
	var srcCalendar = getCalendar(calendarName);
	var dstCalendar = getCalendar("utd");
	
	var after = (year >= 0);
		
	//add up the days for all years until now
	var localDays = year*srcCalendar.daysPerYear;
		
	//add the past months of the current year
	var m=1;
	while(m<month)
	{
		localDays = localDays + srcCalendar.monthLength[m-1];
		m++;
	}
	
	//add the past days of the current month
	localDays = localDays + day-1;
	
	//convert to seconds --------------------------------------- 
	
	//days -> hours
	var localHours = localDays * srcCalendar.locHoursPerDay;
	//add current hour
	localHours = localHours + hour;
	
	//hours -> minutes
	var localMinutes = localHours * srcCalendar.minutesPerHour;
	//add current minute
	localMinutes = localMinutes + minute;
	
	//minutes -> seconds
	var localSeconds = localMinutes * srcCalendar.secondsPerMinute;
	//add current second
	localSeconds = localSeconds + second;
	
	//convert to standard seconds -------------------------------
	
	var standardSeconds = localSeconds
						/ srcCalendar.secondsPerMinute //current value: local minutes
						/ srcCalendar.minutesPerHour //current value: local hours
						/ srcCalendar.locHoursPerDay //current value: local days
						* srcCalendar.stdHoursPerDay //current value: standard hours
						* dstCalendar.minutesPerHour    //current value: standard minutes
						* dstCalendar.secondsPerMinute; //current value: standard seconds
	
	//shift relative to standard time ---------------------------
	return standardSeconds;
}


function setDateTime(which, calendarName, year, month, day, hour, minute, second){
	var standardSeconds = convertToStdSeconds(calendarName, year, month, day, hour, minute, second);
	times[which] = standardSeconds + srcCalendar.offsetUTD;
}




function getDateTime(which, calendarName)
{
	var dstCalendar = getCalendar(calendarName);
	var standardSeconds = times[which] - dstCalendar.offsetUTD;

	return getConvertedTime(calendarName, standardSeconds);
}


function getDeltaTime(startTime, endTime, calendarName)
{
	var deltaStdSec = Math.abs(times[endTime] - times[startTime]);
	return getConvertedTime(calendarName, deltaStdSec);
}


function getConvertedTime(calendarName, standardSeconds){
	var srcCalendar = getCalendar("utd");
	var dstCalendar = getCalendar(calendarName);
	
	
	console.log("converting from \""+srcCalendar.name+"\" to \""+dstCalendar.name+"\"");
	
	var after = (standardSeconds >= 0);
	
	//convert to local seconds ----------------------------------
	
	var localSeconds = standardSeconds
					 / srcCalendar.secondsPerMinute //standard minutes
					 / srcCalendar.minutesPerHour   //standard hours
					 / dstCalendar.stdHoursPerDay //local days
					 * dstCalendar.locHoursPerDay //local hours
					 * dstCalendar.minutesPerHour //local minutes
					 * dstCalendar.secondsPerMinute; //local seconds
	
	if(!after)
		localSeconds = localSeconds + 1;
	
	var second = localSeconds % dstCalendar.secondsPerMinute;
	
	
	var localMinutes = (localSeconds - second)/dstCalendar.secondsPerMinute;
	if(!after)
	{
		//complement
		second = dstCalendar.secondsPerMinute + second -1;
	}
	second = Math.floor(second);
	
	var minute = localMinutes % dstCalendar.minutesPerHour;
	
	var localHours = (localMinutes - minute)/dstCalendar.minutesPerHour;
	if(!after)
	{
		//complement
		minute = dstCalendar.minutesPerHour + minute -1;
	}
	
	var hour = localHours % dstCalendar.locHoursPerDay;
	
	var totalLocalDays = (localHours - hour)/dstCalendar.locHoursPerDay;
	var localDays = totalLocalDays;
	if(!after)
	{
		//complement
		hour = dstCalendar.locHoursPerDay + hour -1;
	}
	
	//extract the date -------------------------------------------
	
	var localYearDays;
	var localYear;
	if(after)
	{
		localYearDays = localDays % dstCalendar.daysPerYear +1;
		localYear = Math.floor(localDays/dstCalendar.daysPerYear);
	}
	else
	{
		localDays = -localDays;
		localYear = Math.floor(localDays/dstCalendar.daysPerYear) +1;
		localYearDays = dstCalendar.daysPerYear
							 - (localDays - (localYear-1)*dstCalendar.daysPerYear);
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
	while((m<dstCalendar.monthNames.length) && (monthName==""))
	{
		if (day <= dstCalendar.monthLength[m])
		{
			monthName = dstCalendar.monthNames[m];
			month = m+1;
		}else{
			day = day - dstCalendar.monthLength[m];
			m = m+1;
		}
		
	}
	
	
	var era;
	var eraIndex;
	if(after)
	{
		era = dstCalendar.eraAfter;
		eraIndex=1;
	}
	else{
		era = dstCalendar.eraBefore;
		eraIndex=0;
	}
	
	var yearFraction = localYearDays/dstCalendar.daysPerYear;
	var dayFraction = (hour + (minute/dstCalendar.minutesPerHour)
						   + (second/(dstCalendar.secondsPerMinute*dstCalendar.minutesPerHour)))
							/ dstCalendar.locHoursPerDay;
	
	var dateTime = {
		year: year,
		eraIndex: eraIndex,
		era: era,
		month: month,
		monthName: monthName,
		totalDays : totalLocalDays,
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

function updateDisplay(calendarName){
	var dateTimeNow = getDateTime("Now", calendarName);
	
	var textNow = "<h3>Current time:</h3>"
					+dateTimeNow.year+" "+dateTimeNow.era+"<br>"
					+"<div class=\"tooltip\">"+dateTimeNow.monthName
						+"<div class=\"tooltip-text\">"
							+dateTimeNow.month+"</div></div> "
					+dateTimeNow.day+"<br>"+getTimeText(dateTimeNow);
	var output = document.getElementById("output-"+calendarName+"-now");
	if(output == undefined)
	{
		console.log("no output for calendar \""+calendarName+"\"");
		return;
	}
	output.innerHTML= textNow;
								
	var dateTimeThen = getDateTime("Then", calendarName);
	
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
	document.getElementById("output-"+calendarName+"-then").innerHTML = textThen;

	var deltaTime = getDeltaTime("Then", "Now", calendarName);
	
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
	document.getElementById("output-"+calendarName+"-diff").innerHTML = textDiff;
}

function setTime(which){
	//get the values and convert them to numbers
	var calendarName = document.getElementById('calendar'+which).value;
	var year = document.getElementById('year'+which).value *1.0;
	var month = document.getElementById('month'+which).value *1.0;
	var day = document.getElementById('day'+which).value *1.0;
	var hour = document.getElementById('hour'+which).value *1.0;
	var minute = document.getElementById('minute'+which).value *1.0;
	var second = document.getElementById('second'+which).value *1.0;
	
	//set the date in the selected calendar
	setDateTime(which, calendarName, year, month, day, hour, minute, second);

	for(name of calendarConfig.calendarNames)
		updateDisplay(name);
}

function submitInputs(which, calendarName){
	//get the values and convert them to numbers
	var year = document.getElementById('year_'+calendarName).value *1.0;
	var eraIndex = document.getElementById('era_'+calendarName).selectedIndex;
	if(eraIndex == 0)
		year = -year;
	
	var month = document.getElementById('month_'+calendarName).value *1.0;
	var day = document.getElementById('day_'+calendarName).value *1.0;
	var hour = document.getElementById('hour_'+calendarName).value *1.0;
	var minute = document.getElementById('minute_'+calendarName).value *1.0;
	var second = document.getElementById('second_'+calendarName).value *1.0;
	
	//set the date in the selected calendar
	setDateTime('Now', calendarName, year, month, day, hour, minute, second);
}

function submitDurationInputs(calendarName){
	//get the values and convert them to numbers
	var year = document.getElementById('year_'+calendarName).value *1.0;
	var day = document.getElementById('day_'+calendarName).value *1.0;
	var hour = document.getElementById('hour_'+calendarName).value *1.0;
	var minute = document.getElementById('minute_'+calendarName).value *1.0;
	var second = document.getElementById('second_'+calendarName).value *1.0;
	
	//set the date in the selected calendar
	time["Duration"] = convertToStdSeconds(calendarName, year, day, hour, minute, second);
}


function limitInputs(calendarName)
{
	var yearInput = document.getElementById('year_'+calendarName);
	var era = document.getElementById('era_'+calendarName).selectedIndex;
	if(era>0)
		yearInput.min = 0;
	else yearInput.min =1;
	yearInput.value = Math.max(yearInput.value, yearInput.min);
	
	
	var dayInput = document.getElementById('day_'+calendarName);
	var month = document.getElementById('month_'+calendarName).value * 1 - 1;
	
	var calendar= getCalendar(calendarName);
	
	dayInput.max = calendar.monthLength[month];
	dayInput.value = Math.min(dayInput.value, dayInput.max);
}

function updateInputs(which, calendarName){
	var dateTime = getDateTime(which, calendarName);
	
	//check whether inputs for this calendar are present
	if(document.getElementById('inputs_'+calendarName) != undefined){
	
		document.getElementById('year_'+calendarName).value = ""+dateTime.year;
	
		var eraDropdown = document.getElementById('era_'+calendarName);
		eraDropdown.selectedIndex = dateTime.eraIndex;
		
			
		document.getElementById('month_'+calendarName).value = ""+dateTime.month;
		document.getElementById('day_'+calendarName).value = ""+dateTime.day;
		document.getElementById('hour_'+calendarName).value = ""+dateTime.hour;
		document.getElementById('minute_'+calendarName).value = ""+dateTime.minute;
		document.getElementById('second_'+calendarName).value = ""+dateTime.second;
	
		limitInputs(calendarName);
	}
}

function updateDurationInputs(calendarName){
	var dateTime = getConvertedTime("Duration", calendarName);
	
	//check whether inputs for this calendar are present
	if(document.getElementById('inputs_'+calendarName) != undefined){
	
		document.getElementById('year_'+calendarName).value = ""+dateTime.year;
			
		document.getElementById('day_'+calendarName).value = ""+dateTime.day;
		document.getElementById('hour_'+calendarName).value = ""+dateTime.hour;
		document.getElementById('minute_'+calendarName).value = ""+dateTime.minute;
		document.getElementById('second_'+calendarName).value = ""+dateTime.second;
	}
}



function updateAllInputs(which){
	for(calendarName of calendarConfig.calendarNames)
	{
		updateInputs(which, calendarName)
	}
}