*[Main repository][repo] is hosted by [Framasoft][framasoft] Gitlab instance. You may find replicant, as on github or gitlab, but they're mirrored... Please, [report bug and comment on framagit][issues]*

# TiddlyWiki Plugins
is a playing space for [TiddlyWiki][tiddlywiki] plugins. Try the demos on [gitlab.io pages][gl-pages] and [github.io pages][demo]. Drag drop the last release from those to your TiddlyWiki to enhance it. You may also find some unreleased work here around : not all experiments are a success.

## [Feather icons](./plugins/sycom/feather-icons) - 0.2
The feather icons plugin aims to integrate feather icons library in TiddlyWiki. Feather is a very open alternative to classic Font Awesome library, using svg sprites instead of classical font implementation. Pretty lightweight and elegant.

## [Leaflet plugin](./plugins/sycom/leaflet) - 0.8
The leaflet plugin is an attempt to integrate the leaflet js library in TiddlyWiki in order to display geographical purpose tiddlers.

For now you can display an interactive map, select size, location and zoom, marker and background. You can also display simple geographical data, stored as json or even stored in metadata fields from tiddler(s) : point(s), polygon(s) and/or polyline(s). Points are clustered when needed (but you can disable clustering) and you have some ways to choose colors.

## [G-Analytics plugin](./plugins/sycom/g-analytics) - 1.0
A tool for having stats of wikis visitors. Forked from the [official one][tw-ga-official] you can find in TiddlyWiki's plugin library. It implements Do Not Track and enables individual tiddlers tracking

## [Atom feed plugin](./plugins/sycom/atom-feed) - 0.0
A very early release of a plugin that creates an atom feed for your wiki. Will possibly help people to follow your news. And maybe will help for SEO?

## [Some macros and widget](./ext/modules)
* **i18n macro** enables multinlingual capabilities without hacking existing `<<lingo>>` mechanism
* **geolocation widget** is part of Leaflet plugin but may also bring geolocation capabilities to your wiki

## Sources / licenses
* [TiddlyWiki][tiddlywiki] uses a BSD 3-Clause [License][tw-license]
* All my projects for TiddlyWiki have [a similar one](LICENSE.md). Please refer to each plugin directory for more informations about sources.

## parcours for my plugins
* **[framagit][repo]** ([issues][issues])
    * [gitlab][gitlab]
        * *gh-pages* > [gitlab.io page][gl-pages]
        * [github][github]
            * *gh-pages* > **[github.io page][demo]**

[repo]: https://framagit.org/sycom/TiddlyWiki-Plugins
[issues]: https://framagit.org/sycom/TiddlyWiki-Plugins/issues
[gitlab]: https://gitlab.com/sycom/TiddlyWiki-Plugins
[gl-pages]: http://sycom.gitlab.io/TiddlyWiki-Plugins/#Leaflet%20plugin
[github]: https://github.com/sycom/TiddlyWiki-Plugins
[tw-ga-official]: https://github.com/sycom/TiddlyWiki5/plugins/tiddlywiki/googleanalytics
[tw-license]: https://github.com/Jermolene/TiddlyWiki5/blob/master/license

[framasoft]: http://framasoft.org
[tiddlywiki]: http://tiddlywiki.com
