(function () {
    // Localize jQuery variable
    var jQuery;

    /******** Load jQuery if not present *********/
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '2.2.4') {
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js");
        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () { // For old versions of IE
                if (this.readyState == 'complete' || this.readyState == 'loaded') {
                    scriptLoadHandler();
                }
            };
        } else {
            script_tag.onload = scriptLoadHandler;
        }
        // Try to find the head, otherwise default to the documentElement
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    } else {
        // The jQuery version on the window is the one we want to use
        jQuery = window.jQuery;
        main();
    }

    /******** Called once jQuery has loaded ******/
    function scriptLoadHandler() {
        // Restore $ and window.jQuery to their previous values and store the
        // new jQuery in our local jQuery variable
        jQuery = window.jQuery.noConflict(true);
        // Call our main function
        main();
    }

    /******** Our main function ********/
    function main() {
        jQuery(document).ready(function ($) {
            /******* Load CSS *******/
            var css_link = $("<link>", {
                rel: "stylesheet",
                type: "text/css",
                href: "https://www.bundesliga-widgets.de/css/widgets.min.css"
            });
            css_link.appendTo('head');

            /******* Load HTML *******/
            var url = "https://www.bundesliga-widgets.de/Widgets/Table";

            if (typeof fblWidgetSettings != 'undefined') {
                var parameterverbinder = "?";
                if (typeof fblWidgetSettings.league != 'undefined') {
                    url = url + "?league=" + fblWidgetSettings.league;

                    parameterverbinder = "&";

                    if (typeof fblWidgetSettings.season != 'undefined') {
                        url = url + "&season=" + fblWidgetSettings.season;
                    }
                }

                if (typeof fblWidgetSettings.compactview != 'undefined') {
                    url = url + parameterverbinder + "compactview=" + fblWidgetSettings.compactview;
                }
            }

            $.get(url, function (data) {
                $('#fblwidget_table').html(data);

                if (typeof fblWidgetSettings != 'undefined') {
                    $('#fblwidget_table').find('.blwTeamName').each(function (index, team) {
                        // Highlight Teams:
                        if (typeof fblWidgetSettings.teamsToHighlight != 'undefined') {
                            fblWidgetSettings.teamsToHighlight.forEach(function (item) {
                                if ($(team).text().indexOf(item) >= 0) {
                                    $(team).addClass('blwHighlighted');
                                }
                            });
                        }

                        // Team-Links:
                        if (typeof fblWidgetSettings.teamLinks != 'undefined') {
                            fblWidgetSettings.teamLinks.forEach(function (item) {
                                if ($(team).text().indexOf(item.teamname) >= 0) {
                                    $(team).wrap('<a href= "' + item.link + '" target= "_blank" />');
                                }
                            });
                        }
                    });
                }
            });
        });
    }
})(); // We call our anonymous function immediately