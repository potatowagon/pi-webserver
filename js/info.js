document.getElementById("day").innerHTML = "Day " + daysSince(new Date(2018,07,20));

//day count 
function daysSince(startDate) {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var today = new Date(); 
    return diffDays = Math.round(Math.abs((today.getTime() - startDate.getTime())/(oneDay)));
}


var helpShown = false;
var infoBlock = document.getElementById("info-block");
document.getElementById("help").onclick = function() {
    if (helpShown) {
        //hide info block
        infoBlock.style.display = "none";
        helpShown = false;
    }
    else {
        //show info block
        infoBlock.style.display = "block";
        helpShown = true;
    }
}