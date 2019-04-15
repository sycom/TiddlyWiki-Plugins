/*\
title: $:/ext/modules/macros/i18n-macro.js
type: application/javascript
module-type: macro

i18n macro for easiest translation of any string outside lingo

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
i18n macro enables automatic translation of a tiddler in wiki language (if exists)
could, maybe, in the future, take care of browser language
*/

exports.name = "i18n";

exports.params = [
  {name: "title"},
  {name: "domain"},
  {name: "orig_lang"},
  {name: "inline"}
];

/*
Run the macro
*/
exports.run = function(title,domain,orig_lang,inline) {
	var self = this,
    dom = domain || "$:",
    base = orig_lang || "en-GB",
    inline = inline || false,
    tiddler = this.wiki.getTiddler(dom+"/i18n/"+base+"/"+title),
		language = this.wiki.getTiddler("$:/language").fields.text || "$:/languages/en-GB",
    lang = this.wiki.getTiddler(language).fields.name,
    translation = this.wiki.getTiddler(dom+"/i18n/"+lang+"/"+title);
  // checks if there is a translation for the tiddlers
  if(!translation) {
  // if not checks if there is an original
    if(!tiddler) {
      // if not displays a text telling the original is not defined
      return "sorry but there is not any [[" + dom+"/i18n/"+base+"/"+title + "]] tiddler";
    }
  // if yes, displays original
    else {
      var alert = "<div class='info'>this text has not been translated in [[" + dom+"/i18n/"+lang+"/"+title + "]]. Displaying original (" + base + ") instead.</div>";
        alert += this.wiki.renderText("text/html",tiddler.parseType,tiddler.fields.text);
      return alert;
    }
	}
	else return this.wiki.renderText("text/html",translation.parseType,translation.fields.text,{parseAsInline: inline})
};

})();
