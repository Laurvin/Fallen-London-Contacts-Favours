// ==UserScript==
// @name Fallen London - Contacts Favours
// @namespace Fallen London - Contacts Favours
// @author Laurvin
// @description Shows the Favours at the top of the page; you will need to refresh manually by clicking the bell icon.
// @version 3.3
// @icon http://i.imgur.com/XYzKXzK.png
// @downloadURL https://github.com/Laurvin/Fallen-London-Contacts-Favours/raw/master/Fallen_London_Contacts_Favours.user.js
// @include https://fallenlondon.com/*
// @include https://www.fallenlondon.com/*
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

function addGlobalStyle(css)
{
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
    console.log("Hey!");
}

function addHTMLElements() // Adds a div for Contact icons and reload button, removes Fallen London logo.
{
    addGlobalStyle('#FLCF { width: 600px; margin-top: 7px; font-size: 14px; }');
    addGlobalStyle('.FLCFdivs { float: left; width: 7%; }');
    $('.top-stripe__site-title').remove();
    $('.top-stripe__inner-container').prepend('<div id="FLCF"> Loading Contact Favours... </div>');
	//$("li").find("[data-name='story']").click(function()
	//{
	//	addHTMLElements();
    //    GetFavors();
	//});
}

function GetFavors()
{
    var access_token = localStorage.getItem("access_token");

	$.ajax({
		method: 'GET',
		url: 'https://api.fallenlondon.com/api/character/myself',
		headers: {
            "authorization": "Bearer " + access_token,
            "accept": "application/json, text/plain, */*"
        },
		timeout: 3000,
		success: function(result) {
			var MySelfData = result;

            for (var i = 0; i < MySelfData.possessions.length; i++) {
                if (MySelfData.possessions[i].name == "Contacts") {
                    var contactsID = i;
                }
            }

            for (i = 0; i < MySelfData.possessions[contactsID].possessions.length; i++) {
                if (MySelfData.possessions[contactsID].possessions[i].name in Favours) {
                    Favours[MySelfData.possessions[contactsID].possessions[i].name] = MySelfData.possessions[contactsID].possessions[i].level;
                }
            }

            var CreatedHTML = "";

            $.each(Favours, function(faction, amount) {
                CreatedHTML += '<div class="FLCFdivs"><img height="20" width="20" border="0" src="https://images.fallenlondon.com/icons/' + FactionIcon[faction] + 'small.png" /> ' + amount + '</div>';
            });

            CreatedHTML += '<div class="FLCFdivs">&nbsp;</div><div class="FLCFdivs" id="FLCFreload" style="cursor:pointer"><img height="20" width="20" border="0" title="Reload" src="https://images.fallenlondon.com/icons/bellsmall.png" /></div>';

            $("#FLCF").html(CreatedHTML);

            $('#FLCFreload').click(function(event) {
                event.preventDefault();
                $('#FLCF').text("Loading Contact Favours...");
                GetFavors();
            });
		},
		error: function(xhr, status, errorThrown) {
			console.log("Error! " + status + errorThrown);
		}
	});
}

$(document).ready(function() {
    'use strict';

    setTimeout(addHTMLElements, 6 * 1000); // x seconds
    setTimeout(GetFavors, 6 * 1000); // x seconds
});
