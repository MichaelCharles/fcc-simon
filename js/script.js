/* global $ */
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
        isPlayerInput: true, // Is the input being given by the player?
        isAcceptingInput: true, // Is simon accepting input at the moment?
        pattern: [], // This contains the current pattern.
        count: 0, // This should equal the length of the pattern array.
        index: 0, // This should represent the index in the array that the player is currently guessing.
        choices: ["red", "yellow", "green", "blue"], // These are the available choices.
        advance: function() { // This function advances the game.
            if (simon.count >= 3) {
                simon.isAcceptingInput = false;

                soundBank.win.onended = function() {
                    simon.reset();
                }
                soundBank.win.play();
            } else {
                var roll = Math.floor(Math.random() * 4);
                var choice = simon.choices[roll];

                simon.pattern.push(choice);
                simon.playPattern();
                simon.count += 1;
            }
        },
        playPattern: function() {
            var patternIndex = 0;
            simon.isAcceptingInput = false;
            simon.isPlayerInput = false;
            var patternPlayer = setInterval(function() {
                simon.isAcceptingInput = true;
                $("#" + simon.pattern[patternIndex] + "-button").click();
                simon.isAcceptingInput = false;
                patternIndex++;
                if (patternIndex >= simon.pattern.length) {
                    simon.isAcceptingInput = true;
                    simon.isPlayerInput = true;
                    if (simon.count < 10) {
                        $("#count-display").text("0" + simon.count);
                    } else {
                        $("#count-display").text(simon.count);
                    }
                    clearInterval(patternPlayer);
                }
            }, 1000);
        },
        reset: function() { //This function resets the game.
            simon.isStrict = false;
            simon.pattern = [];
            simon.isAcceptingInput = true;
            simon.count = 0;
            simon.index = 0;
            simon.isOn = true;
            simon.isPlayerInput = true;
            $("#count-display").text(simon.count);
        },
        // this object handles the different kinds of input that simon can receive
        input: {
            button: function(color) {
                if (simon.isOn) {

                    if (simon.isPlayerInput && simon.pattern.length) {
                        // check against pattern
                        if (color !== simon.pattern[simon.index]) {
                            soundBank.buzzer.onended = function() {
                                simon.index = 0;
                                simon.playPattern();
                            }
                            soundBank.buzzer.play();
                        } else {
                            soundBank[color].play();
                            soundBank[color].onended = function() {
                                simon.index += 1
                                if (simon.index >= simon.pattern.length) {
                                    simon.index = 0;
                                    simon.advance();
                                }
                            }
                        }
                    } else {
                        soundBank[color].play();
                    }
                }
            },
            strict: function() {
                if (this.isOn) {
                    this.isStrict = !this.isStrict
                }
            },
            power: function() {
                simon.isOn = !simon.isOn;
                if (simon.isOn === false) {
                    simon.reset();
                }
            },
            start: function() {
                simon.pattern = [];
                simon.advance();
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
    simon.isAcceptingInput = false;
    setTimeout(function() {
        element.css({
            "background-color": rgbString
        });
        if (simon.isPlayerInput) simon.isAcceptingInput = true;
    }, 400);
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
    if (simon.isAcceptingInput && simon.isOn) {
        $("#green-button").click(function() {

            simon.input.button("green");
            lightUp($(this));

        });
        $("#red-button").click(function() {

            simon.input.button("red");
            lightUp($(this));

        });
        $("#yellow-button").click(function() {

            simon.input.button("yellow");
            lightUp($(this));

        });
        $("#blue-button").click(function() {

            simon.input.button("blue");
            lightUp($(this));

        });

        $("#strict-mode").click(function() {
            if (simon.isOn) simon.input.strict();
        })
        $("#start-game").click(function() {
            simon.input.start();
        })
    }
});