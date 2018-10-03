// ==UserScript==
// @name Fallen London - Contacts Favours
// @namespace Fallen London - Contacts Favours
// @author Laurvin
// @description Shows the Favours at the top of the page; you will need to refresh manually by clicking the bell icon.
// @version 2.0
// @icon http://i.imgur.com/XYzKXzK.png
// @downloadURL https://github.com/Laurvin/Fallen-London-Contacts-Favours/raw/master/Fallen_London_Contacts_Favours.user.js
// @include https://fallenlondon.com/*
// @include https://www.fallenlondon.com/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant GM_xmlhttpRequest
// @run-at document-idle
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var Faction = "";
var FavAmount = 0;

var Favours = {};
Favours['Criminals'] = 0;
Favours['The Docks'] = 0;
Favours['Tomb-Colonies'] = 0;
Favours['Rubbery Men'] = 0;
Favours['Urchins'] = 0;
Favours['Hell'] = 0;
Favours['Constables'] = 0;
Favours['The Great Game'] = 0;
Favours['The Church'] = 0;
Favours['Bohemians'] = 0;
Favours['Revolutionaries'] = 0;
Favours['Society'] = 0;

var FactionIcon = {};
FactionIcon['Criminals'] = 'manaclessmall';
FactionIcon['The Docks'] = 'shipsmall';
FactionIcon['Tomb-Colonies'] = 'tombcolonistsmall';
FactionIcon['Rubbery Men'] = 'rubberymansmall';
FactionIcon['Urchins'] = 'urchinsmall';
FactionIcon['Hell'] = 'devilsmall';
FactionIcon['Constables'] = 'constablebadgesmall';
FactionIcon['The Great Game'] = 'pawnsmall';
FactionIcon['The Church'] = 'clergysmall';
FactionIcon['Bohemians'] = 'bohogirl1small';
FactionIcon['Revolutionaries'] = 'flamessmall';
FactionIcon['Society'] = 'salon2small';

function addGlobalStyle(css)
{
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function addHTMLElements() // Adds a div for Contact icons and reload button.
{
  $('.site-title').append('<div id="FLCF"> Loading Contact Favours... </div>');
  $("body").append('<div id="ContactPage1point0" style="display:none !important;"></div>');
}

function GetFavors()
{
  $("#ContactPage1point0").html('');
  
    GM_xmlhttpRequest({
    method: 'GET',
    url: 'http://fallenlondon.storynexus.com/Me/StatusesForCategory?category=Contacts',
    timeout: 2000,
    onload: function (response)
    {
      $("#ContactPage1point0").html(response.responseText);
      
      $('#ContactPage1point0 span.tt > strong').each(function()
      {
        if($(this).text().indexOf("Favours:") >= 0)
        {
          Faction = $(this).text().substring(9, $(this).text().length-2);

          FavAmount = $(this).text().slice(-1);

          Favours[Faction] = FavAmount;
        }
      });

      var CreatedHTML = "";

      $.each(Favours, function(faction, amount)
      {
        CreatedHTML += '<div class="FLCFdivs"><img height="26" width="20" border="0" src="https://images.fallenlondon.com/icons/' + FactionIcon[faction] + '.png" /> ' + amount + '</div>';
      });

      CreatedHTML += '<div class="FLCFdivs">&nbsp;</div><div class="FLCFdivs" id="FLCFreload" style="cursor:pointer"><img height="26" width="20" border="0" title="Reload" src="http://images.fallenlondon.com/icons/bellsmall.png" /></div>';
      
      $("#FLCF").html(CreatedHTML);
      
      $('#FLCFreload').click(function(event)
      {
        event.preventDefault();
        $('#FLCF').text("Loading Contact Favours...");
        GetFavors();
      });
    },
    onerror: function (response)
    {
      alert('Failed loading.');
    },
    ontimeout: function (response)
    {
      alert('Timed out loading.');
    }
  });
}

$(document).ready(function ()
{
	'use strict';

// 	console.log("Starting!");

	addGlobalStyle('.site-title { background: none !important; cursor: auto !important; color: #bdb29e !important;}');
  addGlobalStyle('#FLCF { margin-top: 7px; font-size: 14px; }');
	addGlobalStyle('.FLCFdivs { float: left; width: 7%; }');
  

  setTimeout(addHTMLElements, 2 * 1000); // 2 seconds
  setTimeout(GetFavors, 2 * 1000); // 2 seconds
	
// 	console.log("Ending!");
});
