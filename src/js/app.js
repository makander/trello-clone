import $ from "jquery";

require("webpack-jquery-ui");
import "../css/styles.css";
import { Domain } from "domain";
import 'jquery-ui/themes/base/all.css';


/**
 * jtrello
 * @return {Object} [Publikt tillgänliga metoder som vi exponerar]
 */

// Här tillämpar vi mönstret reavealing module pattern:
// Mer information om det mönstret här: https://bit.ly/1nt5vXP
const jtrello = (function($) {
  "use strict"; // https://lucybain.com/blog/2014/js-use-strict/

  // Referens internt i modulen för DOM element
  let DOM = {};

  /* =================== Privata metoder nedan ================= */
  function captureDOMEls() {
    DOM.$board = $(".board");
    DOM.$listDialog = $("#list-creation-dialog");
    DOM.$columns = $(".column");
    DOM.$lists = $(".list");
    DOM.$listCards = $(".list-cards");
    DOM.$cards = $(".card");
    DOM.$listHeader = $(".list-header");

    DOM.$newListButton = $("button#new-list");
    DOM.$deleteListButton = $(".list-header > button.delete");

    DOM.$newCardForm = $("form.new-card");
    DOM.$deleteCardButton = $(".card > button.delete");
  }

  function createTabs() {
    $("#tabs").tabs();
  }

  function createDialogs() {
    DOM.$listDialog.dialog({
      modal: true,
      autoOpen: false,
      show: {
        effect: 'bounce',
        duration: 'slow'
      }
    });
  }

  /*
   *  Denna metod kommer nyttja variabeln DOM för att binda eventlyssnare till
   *  createList, deleteList, createCard och deleteCard etc.
   */
  function bindEvents() {
    DOM.$board.on("click", ".list-header > button.delete", deleteList);
    DOM.$board.on("click", "button#new-list", toggleListCreationDialog);
    DOM.$board.on("click", ".list-header > button.delete", deleteList);
    
    $("#peachy").click(function(){
      $('.board').peacher();
    })

    DOM.$board.on("submit", "form.new-card", createCard);
    DOM.$deleteCardButton.on("click", deleteCard);
    $("#tabs").on("submit", createList);
  }

  /* ============== Metoder för att hantera listor nedan ============== */
  function toggleListCreationDialog() {
    if (!$("#list-creation-dialog").dialog("isOpen")) {
      $("#list-creation-dialog").dialog("open");
    } else {
      $("#list-creation-dialog").dialog("close");
    }
  }

  function datePicker() {
    $("#datepicker").datepicker();
  }

  function createList(event) {
    event.preventDefault(); // förhindra omladdning av sida (default behavior för formulär i HTML)
    let newListTitle = $(this)
      .find("input")
      .val();

    let newListDueDate = $(this)
      .find("input#datepicker")
      .val();

    $(".column-unsortable").before(`
    <div class="column">
            <div class="list">
                <div class="list-header">
                    ${newListTitle} | <small>${newListDueDate}</small>
                    <button class="button delete">X</button>
                </div>
                <ul class="list-cards">
                    <li class="add-new">
                        <form class="new-card" action="index.html">
                            <input type="text" name="title" placeholder="Please name the card" />
                            <button class="button add">Add new card</button>
                        </form>
                    </li>
                </ul>
            </div>
        </div> 
    `);
    toggleListCreationDialog("close");
    captureDOMEls();
    moveCard();
    moveColumns();
  }

  function deleteList() {
    console.log("This should delete the list you clicked on");

    $(this)
      .offsetParent()
      .parent()
      .remove();
  }

  function moveColumns() {
    DOM.$columns.sortable({
     connectWith: DOM.$columns
    });
  }


  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function createCard(event) {
    event.preventDefault();
    console.log("This should create a new card");
    let newCardTitle = $(this)
      .find("input")
      .val();

    $(this).closest(".add-new").before(`<li class="card"> 
    ${newCardTitle} <button class="button delete">X</button>
  </li>`);
    $(".delete").click(deleteCard);
  }

  function deleteCard() {
    console.log("This should delete the card you clicked on");
    $(this)
      .offsetParent()
      .fadeOut(1200, function() {
        $(this).remove();
      });
  }

  //Metod för att flytta ett kort till en annan lista
  function moveCard() {
    DOM.$listCards.sortable({
      connectWith: DOM.$listCards,
      cancel: ".column-unsortable",
      cancel: ".add-new"
    });
  }

;(function($, window, document, undefined) {

	var pluginName = "peacher",
  defaults = {
  	className: 'peachy'  
  };

  function Plugin(element, options) {
  	this.element = element;
    this.options = $.extend({}, defaults, options); 
    this._default = defaults;
    this._name = pluginName;
    this.init(); 
  }
  
  Plugin.prototype = {
  	init: function() {
	    this.peacherFunction(this.element, this.options);
    },
    peacherFunction: function(el, options) {
      $(el)
        .addClass(options.className).parents()
        .css("background-image", "linear-gradient(to right, peachpuff , pink")
    }
  };
  
  $.fn[pluginName] = function(options) {
  	return this.each(function() {
    	if (!$.data(this, "plugin_" + pluginName)) {
      	$.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    })
  };
  
})(jQuery, window, document);

  // Metod för att rita ut element i DOM:en
  function render() {}

  /* =================== Publika metoder nedan ================== */

  // Init metod som körs först
  function init() {
    console.log(":::: Initializing JTrello ::::");
    // Förslag på privata metoder
    captureDOMEls();
    createTabs();
    createDialogs();
    bindEvents();
    moveCard();
    moveColumns();
    datePicker();
  }

  // All kod här
  return {
    init: init
  };
})($);

//usage
$("document").ready(function() {
  jtrello.init();
});
