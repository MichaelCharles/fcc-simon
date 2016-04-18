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
        isInGame: false,
        pattern: [],
        count: 0,
        index: 0,
        reset: function() {
            simon.isStrict = false;
            simon.pattern = [];
            simon.isInGame = false;
            simon.count = 0;
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
            },
            start: function() {
                
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
    var $label = $("#strict-label");
    var $sm = $("#strict-mode");
    var $btn = $("#start-game");
    
    // If Strict Mode is checked, uncheck it.
    if ($label.hasClass("is-checked")) {
        $sm.click();
    }
    
    // If Strict Mode is enabled, disable it.
    $sm.prop("disabled", !$sm.prop("disabled"));
    
    if ($label.hasClass("is-disabled")) {
        $label.removeClass("is-disabled");
    } else {
        $label.addClass("is-disabled");
    }
    
    // If the "Start Game" button is enabled, disable it. If disabled, enable it.
    $btn.prop("disabled", !$btn.prop("disabled"));
    
    if ($btn.prop("disabled")) {
        $btn.addClass("mdl-button--disabled");
    } else {
        $btn.removeClass("mdl-button--disabled");
    }
    
    // Fire the "Power Button" input on simon.
    simon.input.power();
});
$("#strict-mode").click(function(){
    if (simon.isOn) simon.input.strict();
})
$("#start-game").click(function(){
    simon.input.start();
})

$(".big-circle").click(function() {
    $("#count-display").text(simon.count);
})

});