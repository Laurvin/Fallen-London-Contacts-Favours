// ==UserScript==
// @name Fallen London - Contacts Favours
// @namespace Fallen London - Contacts Favours
// @author Laurvin
// @description Shows the Favours at the right or top of the page; will check every 20 seconds if the data is still there. To refresh click anywhere in the area, te relocate click the compass.
// @version 5.4
// @icon http://i.imgur.com/XYzKXzK.png
// @downloadURL https://github.com/Laurvin/Fallen-London-Contacts-Favours/raw/master/Fallen_London_Contacts_Favours.user.js
// @updateURL https://github.com/Laurvin/Fallen-London-Contacts-Favours/raw/master/Fallen_London_Contacts_Favours.user.js
// @match https://fallenlondon.com/*
// @match https://www.fallenlondon.com/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @run-at document-idle
// ==/UserScript==

/* globals jQuery, $ */

this.$ = this.jQuery = jQuery.noConflict(true);

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

function addHTMLElements(divLocation) // Adds divs for Contact icons and relocation button.
{
    addGlobalStyle('RightFLCF', '#RightFLCF { width: auto; margin: 18px 2px -17px 2px; text-align: center; font-size: 14px; }'); // Negative bottom margin for the 2 br's.
    addGlobalStyle('TopFLCF', '#TopFLCF { width: auto; margin-top: 7px; font-size: 14px; }');

    $('#RightFLCF').remove();
    $('#TopFLCF').remove();

    GM_setValue("divLocation", divLocation);

    var MoveButtonLocation = "";

    if (divLocation == 'top')
    {
    $('.top-stripe__site-title').remove(); // Removes Fallen London logo.
    $('.top-stripe__inner-container').prepend('<div id="TopFLCF"><div id="ContainerFLCF"></div></div>');
    MoveButtonLocation = "right";
    }
    else
    {
    $('button.travel-button--infobar').after('<div id="RightFLCF"><div id="ContainerFLCF"></div></div>');
    MoveButtonLocation = "top";
    }

    $('#ContainerFLCF').append('<span id="FLCF" title="You can click anywhere here, up to the relocation button to reload."> Loading Contact Favours... &nbsp;</span><span id="MoveFLCF" title="Click here to move favours from top bar to under Travel button and vice versa."><img height="20" width="20" border="0" src="https://images.fallenlondon.com/icons/compasssmall.png" /></span>');

    $('#MoveFLCF').click(function(event) {
        event.preventDefault();
        $('#ContainerFLCF').empty();
        updateFavours(MoveButtonLocation);
    });
}

function GetFavours()
{
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

    var access_token = localStorage.getItem("access_token");

    if (access_token == null) access_token = sessionStorage.getItem("access_token");

	$.ajax({
		method: 'GET',
		url: 'https://api.fallenlondon.com/api/character/myself',
		headers: {
            "authorization": "Bearer " + access_token,
            "accept": "application/json, text/plain, */*"
        },
		timeout: 10000,
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
                CreatedHTML += '<span><img height="20" width="20" border="0" src="https://images.fallenlondon.com/icons/' + FactionIcon[faction] + 'small.png" />&nbsp;' + amount + '</span> &nbsp; ';
            });

            if (tasteGarden > 0) { CreatedHTML += '<img height="20" width="20" border="0" src="https://images.fallenlondon.com/icons/foliagesmall.png" />&nbsp;' + tasteGarden + ' &nbsp; ' };

            if (MySelfData.character.mantelpieceItem.image) CreatedHTML += '<img height="20" width="20" border="0" src="https://images.fallenlondon.com/icons/' + MySelfData.character.mantelpieceItem.image + 'small.png" />&nbsp;' + MySelfData.character.mantelpieceItem.effectiveLevel + ' &nbsp; ';

            if (MySelfData.character.scrapbookStatus.image) CreatedHTML += '<img height="20" width="20" border="0" src="https://images.fallenlondon.com/icons/' + MySelfData.character.scrapbookStatus.image + 'small.png" />&nbsp;' + MySelfData.character.scrapbookStatus.effectiveLevel + ' &nbsp; ';

            $("#FLCF").html(CreatedHTML);

            $('#FLCF').click(function(event) {
                event.preventDefault();
                $('#FLCF').text("Loading Contact Favours...");
                GetFavours();
            });
		},
		error: function(xhr, status, errorThrown) {
			console.log("Error! " + status + " " + errorThrown);
            $('#FLCF').text("Error! " + status + " " + errorThrown);
            GetFavours();
		}
	});
}

function updateFavours(divLocation)
{
    if (!document.querySelector('#FLCF'))
    {
        addHTMLElements(divLocation);
        GetFavours();
    }
}

$(document).ready(function() {
    'use strict';
    let favoursIntervalId = null;

    var divLocation = GM_getValue("divLocation", 'right');

    favoursIntervalId = setInterval(updateFavours, 15000, divLocation);
});
