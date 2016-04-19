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
        advance: function() { 
            // This function advances the game.

        },
        playPattern: function() {
            // This plays the current pattern.
        },
        reset: function() {
            //This function resets the game.

        },
        // this object handles the different kinds of input that simon can receive
        input: {
            button: function(color) {
                // This handles what happens when a color is pressed.
                // The pressed color should be passed in the color
                // argument.
            },
            strict: function() {
                // This enables strict mode.
            },
            power: function() {
                // This powers on and off the simon.
            },
            start: function() {
                // This starts a game of simon.
            }
        }
    }

function lightUp(element, callback) {
    // This function lights up the background of a button
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
    setTimeout(function() {
        element.css({
            "background-color": rgbString
        });
        // Execute callback function.
        callback;
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

    $("#green-button").click(function() {
        if (simon.isAcceptingInput && simon.isOn) {
            simon.input.button("green");
            lightUp($(this));
        }
    });
    $("#red-button").click(function() {
        if (simon.isAcceptingInput && simon.isOn) {
            simon.input.button("red");
            lightUp($(this));
        }
    });
    $("#yellow-button").click(function() {
        if (simon.isAcceptingInput && simon.isOn) {
            simon.input.button("yellow");
            lightUp($(this));
        }
    });
    $("#blue-button").click(function() {
        if (simon.isAcceptingInput && simon.isOn) {
            simon.input.button("blue");
            lightUp($(this));
        }
    });

    $("#strict-mode").click(function() {
        if (simon.isOn && simon.isAcceptingInput) simon.input.strict();
    })
    $("#start-game").click(function() {
        if (simon.isOn && simon.isAcceptingInput) simon.input.start();
    })
});