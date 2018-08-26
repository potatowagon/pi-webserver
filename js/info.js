document.getElementById("day").innerHTML = "Day " + daysSince(new Date(2018,08,19)); 


//day count 
function daysSince(startDate) {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate = startDate;
    var secondDate = new Date(); //today
    return diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
  }

  