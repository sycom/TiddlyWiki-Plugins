/*\
title: $:/ext/modules/macros/i18n-macro.js
type: application/javascript
module-type: macro
version: 0.2.0

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
  {name: "title"}, // short title of the tiddler (without translation path)
  {name: "domain"}, // translation path (default $:)
  {name: "orig_lang"}, // original tiddler language (default en-GB)
  {name: "inline"} // boolean for inline transclusion (default false)
];

/*
Run the macro
*/
exports.run = function(title,domain,orig_lang,inline) {
  // if first run, will create a styling tiddler for edit button
  if($tw.wiki.getTiddler("$:/temp/ext/modules/macros/i18n-style") === undefined) {
    $tw.wiki.setText("$:/temp/ext/modules/macros/i18n-style","text",null,".i18n-edit{float:right;display:none;opacity:0.5} .i18n-edit svg {width:16px} div:hover > p > .i18n-edit, div:hover > .i18n-edit, h1:hover > .i18n-edit, h2:hover > .i18n-edit, h3:hover > .i18n-edit{display:block} .i18n-edit.alert{color:red;margin:0 4px}");
    $tw.wiki.setText("$:/temp/ext/modules/macros/i18n-style","tags",null,"$:/tags/Stylesheet");
  }
  // whatever, let's go for translation
	var parent = this.parentDomNode,
    title = title || this.getVariable("currentTiddler"),
    dom = domain || "$:",
    base = orig_lang || "en-GB",
    inline = inline || false,
    tid = this.wiki.getTiddler(dom+"/i18n/"+base+"/"+title),
		language = this.wiki.getTiddler("$:/language").fields.text || "$:/languages/en-GB";
    var lang;
    if (this.wiki.getTiddler(language) !== undefined) lang = this.wiki.getTiddler(language).fields.name;
    else lang = "en-GB";
    var translation = this.wiki.getTiddler(dom+"/i18n/"+lang+"/"+title),
    option = {};
    //create a style for displaying edit button
    var domNode = this.document.createElement("style");
    domNode.text = "div .i18n-edit {display:none} div:hover .i18n-edit {float:right;display:block}"
    parent.insertBefore(domNode, null);
    if(inline === true) option.parseAsInline = true;
  // checks if there is a translation for the tiddlers
  if(!translation) {
  // if not checks if there is an original
    if(!tid) {
      // if not displays a text telling the original is not defined
      return "<div class='tc-tiddler-info'>sorry but there is not any [[" + dom+"/i18n/"+base+"/"+title + "]] tiddler</div>";
    }
  // if yes, displays original
    else {
      var html = "<$link to='" + dom+"/i18n/"+base+"/"+title + "' class='i18n-edit'>{{$:/core/images/edit-button}}</$link>";
      html += "<$link to='" + dom+"/i18n/"+lang+"/"+title + "' class='i18n-edit alert'> + " + lang + "</$link>";
      html += "\n\n{{" + dom+"/i18n/"+base+"/"+title + "}}";
      return html;
    }
	}
	else {
    var html = "<$link to='" + dom+"/i18n/"+lang+"/"+title + "' class='i18n-edit'>{{$:/core/images/edit-button}}</$link>";
    html += "\n\n{{" + dom+"/i18n/"+lang+"/"+title + "}}";
    return html;
  }
};

})();
