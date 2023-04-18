// ==UserScript==
// @name Fallen London - Contacts Favours
// @namespace Fallen London - Contacts Favours
// @author Laurvin
// @description Shows the Favours at the top of the page; will check every 20 seconds if the data is still there. To refresh the exact numbers click the reload icon.
// @version 4.3.0
// @icon http://i.imgur.com/XYzKXzK.png
// @downloadURL https://github.com/Laurvin/Fallen-London-Contacts-Favours/raw/master/Fallen_London_Contacts_Favours.user.js
// @updateURL https://github.com/Laurvin/Fallen-London-Contacts-Favours/raw/master/Fallen_London_Contacts_Favours.user.js
// @match https://fallenlondon.com/*
// @match https://www.fallenlondon.com/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant none
// @run-at document-idle
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var Favours = {};
Favours['Favours: Criminals'] = 0;
Favours['Favours: The Docks'] = 0;
Favours['Favours: Tomb-Colonies'] = 0;
Favours['Favours: Rubbery Men'] = 0;
Favours['Favours: Urchins'] = 0;
Favours['Favours: Hell'] = 0;
Favours['Favours: Constables'] = 0;
Favours['Favours: The Great Game'] = 0;
Favours['Favours: The Church'] = 0;
Favours['Favours: Bohemians'] = 0;
Favours['Favours: Revolutionaries'] = 0;
Favours['Favours: Society'] = 0;

var FactionIcon = {};
FactionIcon['Favours: Criminals'] = 'manacles';
FactionIcon['Favours: The Docks'] = 'ship';
FactionIcon['Favours: Tomb-Colonies'] = 'bandagedman';
FactionIcon['Favours: Rubbery Men'] = 'rubberyman';
FactionIcon['Favours: Urchins'] = 'urchin';
FactionIcon['Favours: Hell'] = 'devil';
FactionIcon['Favours: Constables'] = 'constablebadge';
FactionIcon['Favours: The Great Game'] = 'pawn';
FactionIcon['Favours: The Church'] = 'clergy';
FactionIcon['Favours: Bohemians'] = 'bohogirl1';
FactionIcon['Favours: Revolutionaries'] = 'flames';
FactionIcon['Favours: Society'] = 'salon2';

function addGlobalStyle(name, css)
{
    // Check if the style element exists in the head
    if (!document.querySelector('head style[data-id="' + name + '"]')) {

        // If the style element doesn't exist, create it
        const styleEl = document.createElement('style');
        styleEl.setAttribute('data-id', name);

        // Add your styles to the style element
        styleEl.innerHTML = css;

        // Add the style element to the head
        document.head.appendChild(styleEl);
    }
}

function addHTMLElements() // Adds a div for Contact icons and reload button, removes Fallen London logo.
{
    addGlobalStyle('FLCF', '#FLCF { width: auto; margin-top: 7px; font-size: 14px; }');
    addGlobalStyle('FLCFdivs', '.FLCFdivs { float: left; width: auto; margin-right: 1em; }');
    $('.top-stripe__site-title').remove();
    $('#FLCF').remove();
    $('.top-stripe__inner-container').prepend('<div id="FLCF"> Loading Contact Favours... </div>');
}

function GetFavours()
{
    var access_token = localStorage.getItem("access_token");

	$.ajax({
		method: 'GET',
		url: 'https://api.fallenlondon.com/api/character/myself',
		headers: {
            "authorization": "Bearer " + access_token,
            "accept": "application/json, text/plain, */*"
        },
		timeout: 5000,
		success: function(result) {
			var MySelfData = result;
            // console.log(MySelfData);
            for (var i = 0; i < MySelfData.possessions.length; i++) {
                if (MySelfData.possessions[i].name == "Contacts") {
                    var contactsID = i;
                }
                 if (MySelfData.possessions[i].name == "Stories") {
                    var storiesID = i;
                }
           }

            for (i = 0; i < MySelfData.possessions[contactsID].possessions.length; i++) {
                if (MySelfData.possessions[contactsID].possessions[i].name in Favours) {
                    Favours[MySelfData.possessions[contactsID].possessions[i].name] = MySelfData.possessions[contactsID].possessions[i].level;
                }
            }

            var tasteGarden = 0;

            for (i = 0; i < MySelfData.possessions[storiesID].possessions.length; i++) {
                if (MySelfData.possessions[storiesID].possessions[i].qualityPossessedId == 69445506) {
                    tasteGarden = MySelfData.possessions[storiesID].possessions[i].level;
                }
            }

            var CreatedHTML = "";

            $.each(Favours, function(faction, amount) {
                CreatedHTML += '<div class="FLCFdivs"><img height="20" width="20" border="0" src="https://images.fallenlondon.com/icons/' + FactionIcon[faction] + 'small.png" /> ' + amount + '</div>';
            });

            if (tasteGarden > 0) { CreatedHTML += '<div class="FLCFdivs"><img height="20" width="20" border="0" src="https://images.fallenlondon.com/icons/foliagesmall.png" /> ' + tasteGarden + '</div>' };

            CreatedHTML += '<div class="FLCFdivs"><img height="20" width="20" border="0" src="https://images.fallenlondon.com/icons/' + MySelfData.character.mantelpieceItem.image + 'small.png" /> ' + MySelfData.character.mantelpieceItem.effectiveLevel + '</div>';

            CreatedHTML += '<div class="FLCFdivs"><img height="20" width="20" border="0" src="https://images.fallenlondon.com/icons/' + MySelfData.character.scrapbookStatus.image + 'small.png" /> ' + MySelfData.character.scrapbookStatus.effectiveLevel + '</div>';

            CreatedHTML += '<div class="FLCFdivs" id="FLCFreload"><button class="button--link button--link-inverse" type="button" style="cursor: pointer; margin-left: 1em;"><i class="fa fa-refresh"></i></button></div>';

            $("#FLCF").html(CreatedHTML);

            $('#FLCFreload').click(function(event) {
                event.preventDefault();
                $('#FLCF').text("Loading Contact Favours...");
                GetFavours();
            });
		},
		error: function(xhr, status, errorThrown) {
			console.log("Error! " + status + errorThrown);
            $('#FLCF').text("Error! " + status + errorThrown);
		}
	});
}

$(document).ready(function() {
    'use strict';
    let favoursIntervalId = null;

    function updateFavours()
    {
        if (document.querySelector('.top-stripe__site-title'))
        {
            addHTMLElements();
            GetFavours();
        }
    }

    favoursIntervalId = setInterval(updateFavours, 20000);
});
