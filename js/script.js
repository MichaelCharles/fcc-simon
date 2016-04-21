/* global $ */
/* global devPanel */
// soundBank ojbect contains all sounds for this project.
var soundBank = {
        red: new Audio("audio/red.mp3"),
        yellow: new Audio("audio/yellow.mp3"),
        green: new Audio("audio/green.mp3"),
        blue: new Audio("audio/blue.mp3"),
        buzzer: new Audio("audio/buzzer.mp3"),
        win: new Audio("audio/win.wav")
    },
    // simon object should have most (if not all) calculations.
    // I want this to be more or a less an engine for the game,
    // that could be made to work with an alternative UI with
    // very little effort.
    simon = {
        isOn: false, // Is the game on or off?
        isStrict: false, // Is the game in strict mode?
        isAcceptingInput: true, // Is simon accepting input at the moment?
        pattern: [], // This contains the current pattern.
        count: 0, // This should equal the length of the pattern array.
        index: 0, // This should represent the index in the array that the player is currently guessing.
        choices: ["red", "yellow", "green", "blue"], // These are the available choices.
        advance: function() {
            if (simon.count === 20) {
                simon.isAcceptingInput = false;
                soundBank.win.onended = function(){
                    simon.reset();
                    $("#count-display").text("00");
                    simon.isAcceptingInput = true;
                }
                soundBank.win.play();
            } else {
            
            var num = simon.count++;
            $("#count-display").text(num < 10 ? "0" + num : num + 1).promise().done(function(){
                
            var roll = Math.floor(Math.random() * 4);
            var choice = simon.choices[roll];
            
            simon.pattern.push(choice);
            simon.playPattern();
            });
            }
        },
        playPattern: function(index) {
            // This plays the current pattern.
            simon.isAcceptingInput = false;
            if (!index) {
                index = 0;
            } 
            if (simon.pattern[index]) {
            lightUp(simon.pattern[index], function(){
                simon.playPattern(index + 1);
            }, 400);
            } else {
                simon.isAcceptingInput = true;
            }
        },
        reset: function() {
            //This function resets the game.
            simon.count = 0;
            simon.index = 0;
            simon.isAcceptingInput = true;
            simon.pattern = [];
        },
        // this object handles the different kinds of input that simon can receive
        input: {
            button: function(color) {
                // This handles what happens when a color is pressed.
                // The pressed color should be passed in the color
                // argument.
                if (simon.isAcceptingInput) {
                    lightUp(color, function() {
                        if (simon.pattern.length > 0) {
                            // Check against pattern.
                            if (simon.pattern[simon.index] === color) {
                                if (simon.index === simon.count - 1) {
                                    simon.index = 0;
                                simon.advance();
                                } else {
                                    simon.index++;
                                }
                            } else {
                                // If wrong play buzzer
                                simon.isAcceptingInput = false;
                                soundBank.buzzer.onended = function() {
                                    // After playing buzzer, if stirct mode then reset
                                    if (simon.isStrict) {
                                        simon.reset();
                                    } else {
                                        // If not strict mode, reset index to 0 and give
                                        // the player another chance to input
                                        simon.index = 0;
                                        simon.playPattern();
                                    }
                                    simon.isAcceptingInput = true;
                                }
                                soundBank.buzzer.play();
                            }
                        }
                    });
                }
            },
            strict: function() {
                // This enables strict mode.
                simon.isStrict = !simon.isStrict;
            },
            power: function() {
                // This powers on and off the simon.
                if (simon.isOn) {
                    simon.isStrict = false;
                    simon.reset();
                }
                simon.isOn = !simon.isOn;
                
            },
        }
    }

function lightUp(color, callback, delay) {
    if (!delay) delay = 0;
    simon.isAcceptingInput = false;
    // This function lights up the background of a button
    var $element = $("#" + color + "-button");
    var currentBg = $element.css("background-color").replace(/[^0-9$.,]/g, '').split(",");
    var lightBg = currentBg.map(function(value) {
        value = parseInt(value) + 50;
        if (value > 255) value = 255;
        return value;
    });
    var rgbString = "rgb(" + currentBg.join(", ") + ")";
    var lightRgbString = "rgb(" + lightBg.join(", ") + ")";
    $element.css({
        "background-color": lightRgbString
    });

    soundBank[color].onended = function() {
        $element.css({
            "background-color": rgbString
        });
        // Execute callback function.
        setTimeout(function(){
            simon.isAcceptingInput = true;
            callback();
        }, delay);
    }
    soundBank[color].play();
}

$(document).ready(function() {
    // Switch should emulate the power of the game turning
    // on and off. 
    $("#switch").click(function(event) {
        // Don't allow the game to be turned off during an ongoing operation.
        if (simon.isAcceptingInput) {
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
        } else {
            event.preventDefault();
        }
    });

    // All of the following buttons should only fire if the simon game
    // is currently on and accepting input.

    $("#green-button").click(function() {
        if (simon.isAcceptingInput && simon.isOn) {
            simon.input.button("green");
        }
    });
    $("#red-button").click(function() {
        if (simon.isAcceptingInput && simon.isOn) {
            simon.input.button("red");
        }
    });
    $("#yellow-button").click(function() {
        if (simon.isAcceptingInput && simon.isOn) {
            simon.input.button("yellow");
        }
    });
    $("#blue-button").click(function() {
        if (simon.isAcceptingInput && simon.isOn) {
            simon.input.button("blue");
        }
    });

    $("#strict-mode").click(function() {
        if (simon.isOn && simon.isAcceptingInput) simon.input.strict();
    })
    $("#start-game").click(function() {
        if (simon.isOn && simon.isAcceptingInput) simon.advance();
    })
});


/* Uncomment this and uncomment devpanel.js from index.html to see
    a dev panel that displays simon's variables */
/*$(document).ready(function() {
    devPanel.show();
    setInterval(function() {
        let simonPattern = Array.from(simon.pattern);

        devPanel.update([
            ["simon.isOn", simon.isOn],
            ["simon.isStrict", simon.isStrict],
            ["simon.isAcceptingInput", simon.isAcceptingInput],
            ["simon.pattern", simonPattern.join(", ")],
            ["simon.count", simon.count],
            ["simon.index", simon.index]
        ]);
    }, 300);
});*/