const moment = require('moment');



const attendanceFunctions = {
	newAttendance : function(body){
		console.log("body in new attendence ===============+>" , body);
		body = {
			day : moment(new Date(), "YYYY-MM-DD HH:mm:ss").format('dddd'),
			time:  moment().utcOffset("+05:30").format('h:mm:ss a'),
			status: "Present",
			userId : body.userId,
			date : new Date().toISOString().split("T")[0] + "T18:30:00.000Z",
			timeLog : {
				in : moment().utcOffset("+05:30").format('h:mm:ss a')
			}
		}
		console.log("proper working =======> body " , body);
		return body;
	},
	calculateDifference : function(foundAttendence , timeLogLength){
		console.log("**************************** " , foundAttendence);
		var in1 = foundAttendence.timeLog[timeLogLength].in;
		var out = foundAttendence.timeLog[timeLogLength].out;
		var inn =  moment(in1, 'hh:mm:ss: a').diff(moment().startOf('day'), 'seconds');		
		var outt =  moment(out, 'hh:mm:ss: a').diff(moment().startOf('day'), 'seconds');		
		console.log("in time ==>", in1 , " seconsds ===>" , inn);
		console.log("out time ==>", out , "seconsds==>" , outt);
		seconds = outt - inn;
		if(foundAttendence.diffrence != "-"){
			var diffrence = moment(foundAttendence.diffrence, 'hh:mm:ss: a').diff(moment().startOf('day'), 'seconds'); 	
			console.log("diffrence ======>" , diffrence);
			seconds = seconds + diffrence;
		}
		console.log("seconds ====>" , seconds);
		seconds = Number(seconds);
		var h = Math.floor(seconds / 3600);
		var m = Math.floor(seconds % 3600 / 60);
		var s = Math.floor(seconds % 3600 % 60);

		var time =  ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);

		console.log("time ==========+>"  , time);
		foundAttendence.diffrence = time;
		foundAttendence.status = "Absent";
		return foundAttendence;
	},
	calculateTimeLog : function(array , resultHours, start , end){
		var workingHours = 0;
		var totalHours = 0;
		var totalHoursToWork;
		var totalHoursWorked;
		// console.log("start ========+++>" , start._d , "end ==>" , end._d);
		console.log("result hours =========>" , resultHours);
		if(resultHours < 1)
			resultHours = 1	
		for(var i = 0 ; i< Math.ceil(resultHours) ; i++){
			console.log(resultHours - i);
			var local = moment(start._d).subtract(i, 'days');
			local =  moment(local._d , "YYYY-MM-DD HH:mm:ss").format('dddd');
			// console.log("add date ====>" , moment(start._d).subtract(i, 'days')._d  , "local ady" ,local);
			totalHours = totalHours + 30600; 
		}
		array.forEach((obj)=>{
			// console.log(obj);
			if(obj.diffrence){
				workingHours = workingHours + moment.duration(obj.diffrence).asSeconds();
				console.log("workingHours ====>" , workingHours);
			}
		});
		//calculate total working hours 
		var minutes = Math.floor(totalHours / 60);
		totalHours = totalHours%60;
		var hours = Math.floor(minutes/60)
		minutes = minutes%60;
		console.log("totalHours ====>" , hours , minutes);
		totalHoursToWork =  hours+":"+minutes+":"+"00";
		//calculate hours worked 
		
		var minutes = Math.floor(workingHours / 60);
		workingHours = workingHours%60;
		var hours = Math.floor(minutes/60)
		minutes = minutes%60;
		totalHoursWorked = hours+":"+minutes+":"+"00";
		console.log("total hours attednent ====>" , totalHoursToWork);
		console.log("total hours to attendnace====>" , totalHoursWorked);
		var obj = {
			"TotalHoursCompleted" : totalHoursWorked,
			"TotalHoursToComplete" : totalHoursToWork
		}
		return obj

	},
	properFormatDate(data){
		console.log("data @228 ===>" , data);
		data.forEach((obj)=>{
			console.log("obj ==>" , moment(obj.date).utc().format('DD-MM-YYYY'));
			obj.date = moment(obj.date).utc().format('DD-MM-YYYY');
			console.log("after date =======>" , obj.date);
		});
		return data
	},
	formatMonthAccordingToDays(data , startDate , endDate){
		var tmp = data[0];
		// console.log(tmp);
		var keys =  Object.keys(...data);
		if(moment().format('MMMM') == moment(startDate).format('MMMM')){
			console.log("same month", moment().format('DD'));
			totalDays = moment().format('DD');
			console.log("keys ==> " , keys);
			console.log(moment(startDate).format('DD') - 1);
			for(var i = 0 ; i < totalDays ; i++){
				momentDate = moment(startDate).add(i , 'Days');
				console.log("start fate ==>" , moment(momentDate).utc().format("DD-MM-YYYY"));
				dateToMatch = moment(momentDate).utc().format("DD-MM-YYYY");
				if(!keys.includes(dateToMatch)){
					console.log("dateToMatch" , dateToMatch)	
					keys.push(dateToMatch);
					tmp[dateToMatch] = "sunday";
				}
			}
		}else{
			var totalDaysInMonth = moment(startDate).daysInMonth();
			console.log("total days in month" , totalDaysInMonth);
			for(var i = 0 ; i < totalDaysInMonth ; i++){
				momentDate = moment(startDate).add(i , 'Days');
				dateToMatch = moment(momentDate).utc().format("DD-MM-YYYY");
				if(!keys.includes(dateToMatch)){
					dd = dateToMatch.split('-')[0];
					mm = dateToMatch.split('-')[1];
					yy = dateToMatch.split('-')[2];
					dateToMatch = mm + "-" + dd + "-" + yy;	
					console.log(" ======>",new Date(dateToMatch));
					dateToMatch = new Date(dateToMatch);
					console.log("days ==>" ,moment(dateToMatch).format('dd') , dateToMatch);
					if(moment(dateToMatch).format('dd') == 'Su'){
						console.log("in if ==>" , moment(dateToMatch).format('DD-MM-YYYY'))
						dateToMatch = moment(dateToMatch).format('DD-MM-YYYY');
						keys.push(dateToMatch);
						tmp[dateToMatch] = "sunday";
					}else{
						dateToMatch = moment(dateToMatch).format('DD-MM-YYYY');
						keys.push(dateToMatch);
						tmp[dateToMatch] = "Holiday or no working day";
					}
				}
			}	
		}

		keys.forEach((key , index)=>{
			dd = key.split('-')[0];
			mm = key.split('-')[1];
			yy = key.split('-')[2];
			key1 = mm + "-" + dd + "-" + yy;
			keys[index] = key1;
		});
		keys.sort((a,b)=>new Date(a)-new Date(b));
		keys.forEach((key , index)=>{
			dd = key.split('-')[1];
			mm = key.split('-')[0];
			yy = key.split('-')[2];
			keys[index] = dd + "-" + mm + "-" + yy;	
		});
		var newObject = [];
		var temp = data[0];
		for(var i = 0; i < keys.length; i++){
			var currentDate = keys[i];
			var obj = {};
			obj[currentDate] = temp[currentDate]
			// newObject[currentDate] = temp[currentDate] // main culript 
			newObject.push(obj);
		}
		var obj =  Object.assign({}, ...newObject);
		var arr = [];
		arr.push(obj);
		
		return arr;
	},
	formatMonthAccordingToDaysSingleEmployee(data , startDate , endDate){
		var keys = [];
		data.forEach((obj)=>{
			obj.date = moment(obj.date).utc().format('DD-MM-YYYY');
			keys.push(obj.date);
		});	
		console.log(keys);
		// console.log("same month", moment().format('MMMM') , moment(startDate).format('MMMM'));

		if(moment().format('MMMM') == moment(startDate).format('MMMM')){
			totalDays = moment().format('DD');
			console.log("keys ==> " , keys);
			console.log(moment(startDate).format('DD') - 1);
			var tmp = data;
			for(var i = 0 ; i < totalDays ; i++){
				momentDate = moment(startDate).add(i , 'Days');
				console.log("start fate ==>" , moment(momentDate).utc().format("DD-MM-YYYY"));
				dateToMatch = moment(momentDate).utc().format("DD-MM-YYYY");
				if(!keys.includes(dateToMatch)){
					dd = dateToMatch.split('-')[0];
					mm = dateToMatch.split('-')[1];
					yy = dateToMatch.split('-')[2];
					dateToMatch = mm + "-" + dd + "-" + yy;	
					console.log(" ======>",new Date(dateToMatch));
					dateToMatch = new Date(dateToMatch);
					console.log("days ==>" ,moment(dateToMatch).format('dd') , dateToMatch);
					if(moment(dateToMatch).format('dd') == 'Su'){
						console.log("in if ==>" , moment(dateToMatch).format('DD-MM-YYYY'))
						dateToMatch = moment(dateToMatch).format('DD-MM-YYYY');
						var obj = {};
						obj['date'] = dateToMatch;
						obj['message'] = "Sunday";
						keys.push(dateToMatch);
						tmp.push(obj);
					}else{
						dateToMatch = moment(dateToMatch).format('DD-MM-YYYY');
						var obj = {};
						obj['date'] = dateToMatch;
						obj['message'] = "AB Or No working day";
						keys.push(dateToMatch);
						tmp.push(obj);
					}
				}
			}
		}else{
			var totalDaysInMonth = moment(startDate).daysInMonth();
			console.log("total days in month" , totalDaysInMonth);
			var tmp = data;
			for(var i = 0 ; i < totalDaysInMonth ; i++){
				momentDate = moment(startDate).add(i , 'Days');
				dateToMatch = moment(momentDate).utc().format('DD-MM-YYYY');
				console.log("moment dte" , dateToMatch);
				if(!keys.includes(dateToMatch)){
					dd = dateToMatch.split('-')[0];
					mm = dateToMatch.split('-')[1];
					yy = dateToMatch.split('-')[2];
					dateToMatch = mm + "-" + dd + "-" + yy;	
					console.log(" ======>",new Date(dateToMatch));
					dateToMatch = new Date(dateToMatch);
					console.log("days ==>" ,moment(dateToMatch).format('dd') , dateToMatch);
					if(moment(dateToMatch).format('dd') == 'Su'){
						console.log("in if ==>" , moment(dateToMatch).format('DD-MM-YYYY'))
						dateToMatch = moment(dateToMatch).format('DD-MM-YYYY');
						var obj = {};
						obj['date'] = dateToMatch;
						obj['message'] = "Sunday";
						keys.push(dateToMatch);
						tmp.push(obj);
					}else{
						dateToMatch = moment(dateToMatch).format('DD-MM-YYYY');
						var obj = {};
						obj['date'] = dateToMatch;
						obj['message'] = "AB Or No working day";
						keys.push(dateToMatch);
						tmp.push(obj);
					}
				}
			}	
		}
		tmp.forEach((tmpObj , index)=>{
			dd = tmpObj.date.split('-')[0];
			mm = tmpObj.date.split('-')[1];
			yy = tmpObj.date.split('-')[2];
			date = mm + "-" + dd + "-" + yy;
			var obj = tmp[index];
			obj.date = date;
			tmp[index] = obj;	
			// console.log("tempObj =====>" , Date.parse(tmpObj.date) , tmpObj.date);
		});
		// console.log("tmp ======++++>",tmp);
		var newObject = [];
		keys.forEach((keyDate , index)=>{
			dd = keyDate.split('-')[0];
			mm = keyDate.split('-')[1];
			yy = keyDate.split('-')[2];
			date = mm + "-" + dd + "-" + yy;
			keys[index] = date;
			// console.log("key ===>" , Date.parse(keys[index]) , keys[index]);
		});
		keys.forEach((keyDate , index)=>{
			console.log("Date ==>" , keyDate);
			tmp.forEach((tmpObj)=>{
				if(keyDate == tmpObj.date){
					newObject.push(tmpObj);
				}
			});	
		});
		newObject.sort((a,b)=>new Date(a.date)-new Date(b.date));
		newObject.forEach((obj , index)=>{
			console.log("obj ==>" , obj.date);
		});
		// console.log(newObject);

		return newObject;
	}
}





module.exports = attendanceFunctions;