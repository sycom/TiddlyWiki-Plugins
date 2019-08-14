/*\
title: $:/plugins/sycom/g-analytics/googleanalytics.js
type: application/javascript
module-type: startup

Runs Google Analytics with the account number in the tiddler `$:/GoogleAnalyticsAccount` and the domain name in `$:/GoogleAnalyticsDomain`. You may also track internal navigation. DNT and GDPR compliant.

\*/
(function() {

  /*jslint node: true, browser: true */
  /*global $tw: false */
  "use strict";

  // Export name and synchronous status
  exports.name = "google-analytics";
  exports.platforms = ["browser"];
  exports.after = ["startup"];
  exports.synchronous = true;

  exports.startup = function() {
    var GA_Launched = 0; // GA active detector
    // initializing disclaimer
    var GA_DISCLAIMER_TITLE = $tw.wiki.getTiddler("$:/plugins/sycom/g-analytics/settings/disclaimer_title").fields.caption || "This wiki uses Google analytics";
    GA_DISCLAIMER_TITLE = GA_DISCLAIMER_TITLE.replace(/\n/g, "");
    // load informations about tracking
    $tw.wiki.setText(GA_DISCLAIMER_TITLE, "text", null, $tw.wiki.getTiddlerText("$:/plugins/sycom/g-analytics/disclaimer"));
    // testing do not track before launching
    var dnt = navigator.doNotTrack || 0;
    if (dnt === "1") {
      // tells the wiki that DNT is on for disclaimer adaptation
      $tw.wiki.setText("$:/temp/GoogleAnalyticsDNT", "text", null, "yes");
    } else {
      // getting parameters - account, domain, tracking tiddlers and gdpr - opt-in
      var GA_ACCOUNT = $tw.wiki.getTiddlerText("$:/GoogleAnalyticsAccount") || "",
        GA_DOMAIN = $tw.wiki.getTiddlerText("$:/GoogleAnalyticsDomain") || "",
        GA_TRACKALL = $tw.wiki.getTiddlerText("$:/plugins/sycom/g-analytics/settings/track_all") || "no",
        GA_GDPR = "yes";
      GA_ACCOUNT = GA_ACCOUNT.replace(/\n/g, "");
      GA_DOMAIN = GA_DOMAIN.replace(/\n/g, "");
      // handling domain parameter : user defined > from window location > "auto" fallback
      if (GA_DOMAIN == "") GA_DOMAIN = window.location.hostname;
      if (GA_DOMAIN == undefined) GA_DOMAIN = "auto";
      GA_TRACKALL = GA_TRACKALL.replace(/\n/g, "");
      // create a "hook" on navigation to send data via tracker
      $tw.wiki.addEventListener("change", function(changes) {
        // if first launch, initiates GA
        if (GA_Launched === 0) {
          // using ga "isogram" function
          (function(i, s, o, g, r, a, m) {i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function() {(i[r].q = i[r].q || []).push(arguments)}, i[r].l = 1 * new Date();a = s.createElement(o),  m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
          GA_Launched = 1;
        }
        // get informations about GDPR opt-in (or not)
        GA_GDPR = $tw.wiki.getTiddlerText("$:/temp/GoogleAnalyticsGDPRoption") || "yes";
        GA_GDPR = GA_GDPR.replace(/\n/g, "");
        if (GA_GDPR !== "yes") {
          // GDPR has been cleared by opt-in
          if (GA_TRACKALL === "yes") {
            ga('create', GA_ACCOUNT, GA_DOMAIN);
            // dealing with user settings !todo check if options is associated with wiki or $tw
            var options = $tw.wiki.options || {},
              storyTitle = options.storyTitle || "$:/StoryList",
              historyTitle = options.historyTitle || "$:/HistoryList";
            // getting storyList (displayed) historyList (last displayed) and last item
            var storyList = $tw.wiki.getTiddler(storyTitle).fields.list;
            var history = $tw.wiki.getTiddlerText(historyTitle) || "[{\"title\": \"" + storyList[0] + "\"}]";
            var historyList = JSON.parse(history);
            var GA_CURRENT = historyList[historyList.length - 1].title;
            // if last item has not been closed, prepare data and send to tracker
            if (storyList.includes(GA_CURRENT)) {
              // if history modified is true send tracker (else user may just closed another tiddler)
              // note that clicking on a tiddlerlink from already opened tiddler will count
              if ((historyList.length ===1 || changes[historyTitle]) && GA_GDPR !== "yes") {
                ga('set', 'page', window.location.pathname + '/' + GA_CURRENT);
                ga('set', 'title', GA_CURRENT);
                ga('send', 'pageview');
              }
            }
          } else {
            // get informations about GDPR opt-out
            GA_GDPR = $tw.wiki.getTiddlerText("$:/temp/GoogleAnalyticsGDPRoption") || "yes";
            GA_GDPR = GA_GDPR.replace(/\n/g, "");
            // send data for whole page once only
            ga('create', GA_ACCOUNT, GA_DOMAIN);
            ga('send', 'pageview');
          }
        }
      });
    }
  }
})();
