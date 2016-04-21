/* global $ */

var $panel = $("<div class='dev-panel-container'></div>"),
    $styles = $("<style>.dev-panel-container {z-index:-1;font-family:'Source Code Pro', monospace; position: absolute; background-color: #626262; box-shadow: inset 1px 3px 10px 0px rgba(0,0,0,0.75); border-radius: 4px; top: 16px; left: 16px; padding: 1em;width: 300px;height: 90vh;}p{font-weight: 700;margin: 0;padding 0; color:white; }</style>"),
    devPanel = {
    show: function() {
        $("head").append($styles);
        $("body").prepend($panel);        
    },
    update: function(values){
        $panel.html("");
        for (let i = 0; i < values.length; i++) {
            $panel.html($panel.html() + "<p>" + values[i][0] + ": " + values[i][1] + "</p>");
        }
    }
}