Whatever type of interaction you intend to have with the project, I only have a few words : **You are welcome!**

## Use, test, comment

Any usage you have is a good thing. So if you have no background in coding or anything of this, go ahead to [demo front page][demo], take the tool and use it.

If everything is OK for you, enjoy and don't hesitate to make contact and tell about your experience or use case. It's good to know what tools are used for to plane further developments.

If you have bug, problems, suggestions, or any comment

* **the best way to proceed is posting an [issue][issues]**. You will need a framagit account (you can also log in with gitlab, github or bitbucket). It's also a good place to check if your subject is already listed
* You may also post on the [tiddlywiki users group][group]. Be explicit in the title if you want an answer ;-)

## Help with translations

The projects tries to support multiple language for both documentation and tools. It is far from easy when your English is limited and have no real background for other language. So do not hesitate to submit your translation in any language of any part of the project.

## Work the code

### How the repo works, how to work with it

You may want to fork and contribute to the project. Or you just want use it as a framework for your needs and work by yourself on different projects. It's up to you...

The repository is set up to minimize conflict with tiddlywiki core and own storage. So the project only stores its files and settings and calls TiddlyWiki for running either through a node installation or using the official repository. This is a good way to test developments with the latest release, the current master branch and any other version of the core.

### What you will need

* A [git][git] installation with or without a gui
* A [node][nodejs] installation

### How to setup yours (wether you want to contribute or not)

Instruction are given through the command line, but if you prefer genuine user interfaces you will easily find your way through.

Please note that integrated _bash_ / _bat_ scripts work with local copies folders named `TW5dev` and `tiddlywiki5`. You will have to edit those scripts if you want to use your own directories names.

* **You may want to fork** from one of the main public repositories where the project is stored. You will find a button for that on each, once you have an account there :
  * [framagit][framagit] (gitlab instance)
  * [gitlab][gitlab]
  * [github][github]

this will create a repo linked to the main TiddlyWiki-Plugins repo that will be your basecamp

* **Clone the repo on your machine**
  * From your repo and then set main repo as upstream
    ```
    git clone https://your_git_provider/user_name/your_repo_name.git TW5dev
    git remote add upstream https://framagit.org/sycom/TiddlyWiki-Plugins.git
    ```
    Or directly from the main repo and set it as upstream if you do not have a fork
    ```
    git clone https://framagit.org/sycom/TiddlyWiki-Plugins.git -o upstream your_repo_name
    ```

* **Set up basics to work**
  You will need either (or both)
  * a node installation of tiddlywiki
    ```
    npm install -g tiddlywiki
    ```
  * a working copy of tiddlywiki main repo
    ```
    git clone https://github.com/Jermolene/TiddlyWiki5.git -o upstream tiddlywiki5
    ```

### **Work, test your work**
once you made your edit on your project you have a lot of choices and may use the `tw.bat` (no `tw.sh` for now)

* Using **nodejs installed** tiddlywiki
  * launching server for _tid files / node_ version (on http://127.0.0.1:8080)
    ```
    tiddlywiki ./edition/your_edition
    ```
    or
    ```
    tw your_edition
    ```
    * building _index.html_ tiddlywiki file (in [.editions/your_edition/output](#)
    ```
    tiddlywiki ./edition/your_edition --build
    ```
    or
    ```
    tw your_edition build
    ```

* Using **local copy of tiddlywiki** official repository
  * launching server for _tid files / node_ version (on http://127.0.0.1:8080)
    ```
    node ../tiddlywiki5/tiddlywiki.js ../TW5dev/editions/your_edition
    ```
    or
    ```
    tw -l your_edition
    ```
  * building _index.html_ tiddlywiki file (in [.editions/your_edition/output](#))
    ```
    node ../tiddlywiki5/tiddlywiki.js ../TW5dev/editions/your_edition --build
    ```
    or
    ```
    tw -l your_edition build
    ```

Once your proud of your work, pretty sure that whole tiddlywiki community will be glad to know about. Use the [group][group] is probably the quickiest and most efficient way.

### Merge requests

If you have merge requests proposals for the current project (nice! thank you), please try to do it through the [framagit][framagit] repository since managing more than one upstream would be a bit touchy.

Happy Contributing!

[fr-FR]: ./editions/collection/tiddlers/i18n/fr-FR/CONTRIBUTING.md

[git]: https://git-scm.com/
[nodejs]: https://nodejs.org

[issues]: https://framagit.org/sycom/TiddlyWiki-Plugins/issues
[group]: https://groups.google.com/forum/#!forum/tiddlywiki

[demo]: https://sycom.frama.io/TiddlyWiki-Plugins
[framagit]: https://framagit.org/sycom/TiddlyWiki-Plugins
[gitlab]: https://gitlab.com/sycom/TiddlyWiki-Plugins
[github]: https://github.com/sycom/TiddlyWiki-Plugins
