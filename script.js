// countdown
var countdownElement;
var timeValue = Date.parse("21 July 2019 14:00:00");
var countdownInterval;
var isCounting = false;

// infection
var infectionInterval;
var startInfected = 0;
var infected = 0;

// local storage
var startInfectedKey = "startInfected";

// debug
var timeOffset = 0;
// end debug

var value_map = new Object();
value_map[Date.parse("19 July 2019 23:00:00")] = 20021;
value_map[Date.parse("20 July 2019 09:00:00")] = 90467;
value_map[Date.parse("20 July 2019 12:00:00")] = 240372;
value_map[Date.parse("20 July 2019 16:00:00")] = 803650;
value_map[Date.parse("20 July 2019 20:00:00")] = 2480102;
value_map[Date.parse("20 July 2019 23:00:00")] = 4486010;
value_map[Date.parse("21 July 2019 09:00:00")] = 5000901;
value_map[Date.parse("21 July 2019 14:00:00")] = 7623040;

$(document).ready(function () {
    countdownElement = $("#countdown");
    infectedElement = $("#infected");
    startTimer();
    startInfected = parseInt(localStorage.getItem(startInfectedKey));

    // debug
    // timeOffset = Date.parse("19 July 2019 22:00:00") - Date.now();
    // timeOffset = Date.parse("20 July 2019 08:50:00") - Date.now();
    // timeOffset = Date.parse("20 July 2019 09:10:00") - Date.now();
    // timeOffset = Date.parse("20 July 2019 12:10:00") - Date.now();
    // timeOffset = Date.parse("20 July 2019 16:10:00") - Date.now();
    // timeOffset = Date.parse("20 July 2019 20:10:00") - Date.now();
    // timeOffset = Date.parse("20 July 2019 23:10:00") - Date.now();
    // timeOffset = Date.parse("21 July 2019 09:10:00") - Date.now();
    // timeOffset = Date.parse("21 July 2019 11:59:30") - Date.now();
    // timeOffset = Date.parse("21 July 2019 13:59:50") - Date.now();
    // end debug

    if (!isNaN(startInfected)) {
        startInfection();
    }
});

function updateTimerElement(date) {
    var seconds = Math.floor((date / 1000) % 60);
    var minutes = Math.floor((date / 1000 / 60) % 60);
    var hours = Math.floor((date / (1000 * 60 * 60)) % 24);
    var days = Math.floor(date / (1000 * 60 * 60 * 24));

    if ( days == 0 && hours <= 1 ){
        countdownElement.addClass("warning");
    }

    countdownElement.html(days + " : " + pad(hours) + " : " + pad(minutes) + " : " + pad(seconds));
}

function updateInfectedElement(infected) {
    infectedElement.html(Math.floor(infected));
}

function startTimer() {
    clearInterval(countdownInterval);
    startCountdown(timeValue);
}

function startCountdown() {
    countdownInterval = setInterval(function () {
        var time_diff = timeValue - ( Date.now() + timeOffset );
        time_diff = Math.max(0, time_diff);
        updateTimerElement(time_diff);
        isCounting = true;
    }, 1000);
}

function pad(num) {
    var s = "0" + num;
    return s.substr(-2);
}

function startInfection() {
    var group = $("#infection-setup");

    if ( isNaN(startInfected) ) {
        var input = $("#infected-nr");
        startInfected = parseInt(input.val());
        if (isNaN(startInfected)) return;
        localStorage.setItem(startInfectedKey, startInfected);
    }
    // value_map[Date.now() + timeOffset] = startInfected;
    value_map[Date.parse("19 July 2019 20:00:00")] = startInfected;

    group.hide();

    const deltaTime = 100;
    const keys = Object.keys(value_map);
    keys.sort();

    var index = 0;
    var previous_infected = startInfected;
    var previous_time = 0;
    var target_time = parseInt(keys[index]);
    infectionInterval = setInterval(function () {
        var current_time = Date.now() + timeOffset;
        while ( current_time > target_time ) {
            previous_infected = value_map[target_time];
            previous_time = target_time;
            if (index < keys.length - 1) {
                index++;
                target_time = parseInt(keys[index]);
            } else {
                clearInterval(infectionInterval);
                return;
            }
        }
        var target_infected = value_map[target_time];
        infected = lerp(previous_infected, target_infected, ( current_time - previous_time ) / (target_time - previous_time));
        if (isCounting) {
            updateInfectedElement(infected);
        }
    }, deltaTime);

}

function reset() {
    clearInterval(infectionInterval);
    localStorage.removeItem(startInfectedKey);
    var group = $("#infection-setup");
    group.show();
    infectionStartTime = 0;
    infection = 0;
    updateInfectedElement(infected);
}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}