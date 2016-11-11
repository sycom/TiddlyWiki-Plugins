*[Main repository][repo] is hosted by [Framasoft][framasoft] Gitlab instance. You may find replicant, as on github, but they're mirrored... Please, [report bug and comment on framagit][issues]*

# TiddlyWiki Plugins
is a playing space for [TiddlyWiki][tiddlywiki] plugins. Try the demo on [gitlab.io pages][gl-pages] and [github.io pages][demo]. Feel free to drag drop the last release from those to your TiddlyWiki.

## Leaflet plugin - 0.7
The leaflet plugin is an attempt to integrate the [leaflet][leaflet] lib in TiddlyWiki in order to display geographical purpose tiddler.

For now you can display an interactive map, select size, location and zoom, and background. You can also display simple geographical data, stored as json or even stored in metadata fields from tiddler(s) : point(s), polygon(s) and/or polyline(s). Points are clustered when needed (but you can disable clustering) and you have some ways to choose colors.

See [demo online][demo] to learn more. Source code at [sycom/TiddlyWikiPlugins][repo] on framagit (gitlab instance) see `leaflet` branch for latest draft version.

## Sources / licenses
* [TiddlyWiki][tiddlywiki] of course - [License][https://github.com/Jermolene/TiddlyWiki5/blob/master/license.md]
* [leaflet][leaflet] library - License 2-clause BSD
    * leaflet-[markerCluster][markercluster] extension - Licence MIT

## parcours
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
[demo]: http://sycom.github.io/TiddlyWiki-Plugins/#Leaflet%20plugin

[framasoft]: http://framasoft.org
[tiddlywiki]: http://tiddlywiki.com
[leaflet]: http://leafletjs.com/
[markercluster]: https://github.com/Leaflet/Leaflet.markercluster
