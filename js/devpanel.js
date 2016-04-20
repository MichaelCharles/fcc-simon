/* global $ */

var $panel = $("<div class='dev-panel-container'>"),
    $styles = $("<style>.dev-panel-container {font-family:'Source Code Pro', monospace; font-weight: 700; position: absolute; background-color: rgba(0,0,0,0.4); color: white; top: 0; left: 0; padding: 1em;</style>}</style>"),
    devPanel = {
    show: function() {
        $("head").append($styles);
        $("body").append($panel);        
    },
    update: function(values){
        $panel.html("");
        for (let i = 0; i < values.length; i++) {
            $panel.html($panel.html() + "<p>" + values[i][0] + ": " + values[i][1] + "</p>");
        }
    }
}