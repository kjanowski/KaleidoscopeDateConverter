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
	
	var indexUTD = calendarConfig.calendarNames.indexOf("utd");
	var utdCalendar = calendarConfig.params[indexUTD];
	
	var offsetFactor = utdCalendar.daysPerYear
					 * utdCalendar.stdHoursPerDay
					 * utdCalendar.minutesPerHour
					 * utdCalendar.secondsPerMinute;
	for(calendar of calendarConfig.params)
	{
		if(calendar != 'utd')
			calendar.offsetUTD = calendar.rawOffsetUTD*offsetFactor;
	}
}

//=================================================================
// calculating time
//=================================================================


function setDateTime(which, calendar, year, month, day, hour, minute, second){
	
	var srcCalendarIndex = calendarConfig.calendarNames.indexOf(calendar);
	var srcCalendar = calendarConfig.params[srcCalendarIndex];
	
	var dstCalendarIndex = calendarConfig.calendarNames.indexOf("utd");
	var dstCalendar = calendarConfig.params[dstCalendarIndex];
	
	
	
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
	
	times[which] = standardSeconds + srcCalendar.offsetUTD;
}




function getDateTime(which, calendarName)
{
	var dstCalendarIndex = calendarConfig.calendarNames.indexOf(calendarName);
	var dstCalendar = calendarConfig.params[dstCalendarIndex];	
	var standardSeconds = times[which] - dstCalendar.offsetUTD;

	return getConvertedTime(calendarName, standardSeconds);
}


function getDeltaTime(calendarName)
{
	var deltaStdSec = Math.abs(times["Now"] - times["Then"]);
	return getConvertedTime(calendarName, deltaStdSec);
}


function getConvertedTime(calendarName, standardSeconds){
	var srcCalendarIndex = calendarConfig.calendarNames.indexOf("utd");
	var srcCalendar = calendarConfig.params[srcCalendarIndex];	
	var dstCalendarIndex = calendarConfig.calendarNames.indexOf(calendarName);
	var dstCalendar = calendarConfig.params[dstCalendarIndex];	
	
	
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
	//console.log("["+calendar+"] hours:"+hour);
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
	
	var calendarIndex = calendarConfig.calendarNames.indexOf(calendarName);
	var calendar = calendarConfig.params[calendarIndex];
	
	dayInput.max = calendar.monthLength[month];
	dayInput.value = Math.min(dayInput.value, dayInput.max);
}

function updateInputs(which, calendar){
	var dateTime = getDateTime(which, calendar);
	
	//check whether inputs for this calendar are present
	if(document.getElementById('inputs_'+calendar) != undefined){
	
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
}

function updateAllInputs(which){
	for(calendar of calendarNames)
	{
		updateInputs(which, calendar)
	}
}