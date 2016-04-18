/* global $ */

var soundBank = {
        red: new Audio("audio/red.mp3"),
        yellow: new Audio("audio/yellow.mp3"),
        green: new Audio("audio/green.mp3"),
        blue: new Audio("audio/blue.mp3"),
        batsu: new Audio("audio/buzzer.mp3"),
        maru: new Audio("audio/win.wav")
    },
    simon = {
        isOn: false,
        isStrict: false,
        count: 0,
        pattern: [],
        reset: function() {
            this.isStrict = false;
            this.count = 0;
            this.pattern = [];
        },
        input: {
            green: function() {
                if (simon.isOn) {
                    soundBank.green.play();
                }
            },
            red: function() {
                if (simon.isOn) {
                    soundBank.red.play();
                }
            },
            yellow: function() {
                if (simon.isOn) {
                    soundBank.yellow.play();
                }
            },
            blue: function() {
                if (simon.isOn) {
                    soundBank.blue.play();
                }
            },
            strict: function() {
                if (this.isOn){this.isStrict = !this.isStrict}
            },
            power: function() {
                simon.isOn = !simon.isOn;
                if (simon.isOn === false) {
                    simon.reset();
                }
            }
        }
    }

function lightUp(element) {
    var currentBg = element.css("background-color").replace(/[^0-9$.,]/g, '').split(",");
    var lightBg = currentBg.map(function(value) {
        value = parseInt(value) + 50;
        if (value > 255) value = 255;
        return value;
    }); 
    var rgbString = "rgb(" + currentBg.join(", ") + ")";
    var lightRgbString = "rgb(" + lightBg.join(", ") + ")";
    element.css({
        "background-color": lightRgbString
    });
    setTimeout(function(){
        element.css({
            "background-color": rgbString
        })
    }, 400);
}

$(document).ready(function(){

$("#green-button").click(function(){
    simon.input.green();
    if (simon.isOn) lightUp($(this));
});
$("#red-button").click(function(){
    simon.input.red();
    if (simon.isOn) lightUp($(this));
});
$("#yellow-button").click(function(){
    simon.input.yellow();
    if (simon.isOn) lightUp($(this));
});
$("#blue-button").click(function(){
    simon.input.blue();
    if (simon.isOn) lightUp($(this));
});
$("#switch").click(function(){
    simon.input.power();
    $("#strict-mode").prop("disabled", !$("#strict-mode").prop("disabled"));

    $('#strict-mode').click().click();
});
$("strict-mode").click(function(){
    if (simon.isOn) simon.input.strict();
})

});