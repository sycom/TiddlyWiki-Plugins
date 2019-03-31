*[Main repository][repo] is hosted by [Framasoft][framasoft] Gitlab instance. You may find replicant, as on github or gitlab, but they're mirrored... Please, [report bug and comment on framagit][issues]*

# TiddlyWiki Plugins
is a playing space for [TiddlyWiki][tiddlywiki] plugins. Try the demos on [gitlab.io pages][gl-pages] and [github.io pages][demo]. Drag drop the last release from those to your TiddlyWiki to enhance it.

## [Feather icons](./plugins/sycom/feather-icons) - 0.1
The feather icons plugin aims to integrate feather icons library in TiddlyWiki. Feather is a very open alternative to classic Font Awesome library, using svg sprites instead of classical font implementation. Pretty lightweight and elegant.

## [Leaflet plugin](./plugins/sycom/leaflet) - 0.8
The leaflet plugin is an attempt to integrate the leaflet js library in TiddlyWiki in order to display geographical purpose tiddlers.

For now you can display an interactive map, select size, location and zoom, marker and background. You can also display simple geographical data, stored as json or even stored in metadata fields from tiddler(s) : point(s), polygon(s) and/or polyline(s). Points are clustered when needed (but you can disable clustering) and you have some ways to choose colors.

## Google Analytics plugin - i s o g r a m variation - 5.1.14
The legacy plugin used in tiddlywiki.com version is using the old urchin tracker code. This one uses the new //i s o g r a m// version. Note that this plugin is not developed on this repo but on the [tiddlywiki5 fork of jermolene's][tw5github]

## Sources / licenses
* [TiddlyWiki][tiddlywiki] uses a BSD 3-Clause [License](https://github.com/Jermolene/TiddlyWiki5/blob/master/license.md)
* All my projects for TiddlyWiki have [a similar one](LICENSE.md). Please refer to each plugin directory for more inforations.

## parcours for my plugins
* **[framagit][repo]**
    * [gitlab][gitlab]
        * *gh-pages* > [gitlab.io page][gl-pages]
        * [github][github]
            * *gh-pages* > **[github.io page][demo]**

[repo]: https://framagit.org/sycom/TiddlyWikiPlugins
[issues]: https://framagit.org/sycom/TiddlyWikiPlugins/issues
[gitlab]: https://gitlab.com/sycom/TiddlyWikiPlugins
[gl-pages]: http://sycom.gitlab.io/TiddlyWiki-Plugins/#Leaflet%20plugin
[github]: https://github.com/sycom/TiddlyWiki-Plugins
[tw5github]: https://github.com/sycom/TiddlyWiki5

[framasoft]: http://framasoft.org
[tiddlywiki]: http://tiddlywiki.com
[feather]: https://feathericons.com/
