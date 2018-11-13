// ==UserScript==
// @name Fallen London - Contacts Favours
// @namespace Fallen London - Contacts Favours
// @author Laurvin
// @description Shows the Favours at the top of the page; you will need to refresh manually by clicking the bell icon.
// @version 3.1
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
FactionIcon['Favours: Criminals'] = 'manaclessmall';
FactionIcon['Favours: The Docks'] = 'shipsmall';
FactionIcon['Favours: Tomb-Colonies'] = 'tombcolonistsmall';
FactionIcon['Favours: Rubbery Men'] = 'rubberymansmall';
FactionIcon['Favours: Urchins'] = 'urchinsmall';
FactionIcon['Favours: Hell'] = 'devilsmall';
FactionIcon['Favours: Constables'] = 'constablebadgesmall';
FactionIcon['Favours: The Great Game'] = 'pawnsmall';
FactionIcon['Favours: The Church'] = 'clergysmall';
FactionIcon['Favours: Bohemians'] = 'bohogirl1small';
FactionIcon['Favours: Revolutionaries'] = 'flamessmall';
FactionIcon['Favours: Society'] = 'salon2small';

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
}

function addHTMLElements() // Adds a div for Contact icons and reload button, removes Fallen London logo.
{
    $('.top-stripe__site-title').remove();
    $('.top-stripe__inner-container').prepend('<div id="FLCF"> Loading Contact Favours... </div>');
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
                CreatedHTML += '<div class="FLCFdivs"><img height="26" width="20" border="0" src="https://images.fallenlondon.com/icons/' + FactionIcon[faction] + '.png" /> ' + amount + '</div>';
            });

            CreatedHTML += '<div class="FLCFdivs">&nbsp;</div><div class="FLCFdivs" id="FLCFreload" style="cursor:pointer"><img height="26" width="20" border="0" title="Reload" src="https://images.fallenlondon.com/icons/bellsmall.png" /></div>';

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

    addGlobalStyle('#FLCF { width: 600px; margin-top: 7px; font-size: 14px; }');
    addGlobalStyle('.FLCFdivs { float: left; width: 7%; }');

    setTimeout(addHTMLElements, 2 * 1000); // 2 seconds
    setTimeout(GetFavors, 2 * 1000); // 2 seconds
});
