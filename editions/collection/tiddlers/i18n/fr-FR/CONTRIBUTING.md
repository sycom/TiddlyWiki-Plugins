# CONTRIBUTING.MD

Quel que soit le type de rapport que vous souhaitez avoir avec le projet, je n'ai que quelques mots : **Ça nous fait plaisir !**

## Utiliser, tester, commenter

Toute utilisation est une bonne chose. Donc même si vous ne pratiquez pas la programmation ou rien s'en approchant, allez à la [page de démonstration][demo], saisissez-vous des outils et utilisez les.

Si tous vous convient, profitez en bien et n'hésitez pas à nous parler de votre expérience et de vos usages. Il est toujours bon de savoir à quoi sont utilisés les outils pour les développements ultérieurs.

Si vous rencontrez des difficultés, bogues, avez des suggestions ou des commentaires

* **le mieux est de poster une _[issue][issues]_** (si vous ne savez pas l'anglais, nous traduirons). Il vous faudra un compte framagit (vous pouvez vous connecter avec gitlab, github ou bitbucket). C'est aussi un bon endroit pour savoir si le sujet a déjà été abordé,
* Vous pouvez laisser un message sur le [groupe d'utilisateurs tiddlywiki][group] (en anglais seulement) ou sur le moins fréquenté mais fort convivial [groupe en français][fr_group]. Trouvez un titre explicite si vous voulez une réponse ;-)

## Aider pour les traductions

Le projet essaye de proposer une traduction dans plusieurs langues à la fois pour la documentation et les outils (la preuve !). C'est loin d'être facile quand votre anglais est limité et que vous n'avez pas de réelle compétence dans aucune autre langue. Donc n'hésitez pas à proposer vos traductions dans n'importe quelle langue pour toute partie du projet.

## Travailler sur le code

### Comment le dépôt fonctionne, comment travailler avec

Vous voudrez peut-être _forker_ et contribuer au projet. Ou peut-être juste l'utiliser comme un canevas pour vos besoins et travailler sur d'autres projets. À vous de voir.

Le dépôt est organisé pour essayer de limiter les conflits avec le programme principal de TiddlyWiki ainsi que le volume de stockage. Donc il ne stocke que ses propres fichiers et fait appel à TiddlyWiki pour fonctionner soit via une installation node, soit en utilisant le dépôt officiel. C'est une bonne façon de tester les développements tant sur la dernière version officielle que sur la version en cours de développement.

### De quoi aurez-vous besoin ?

* Une installation de [git][git] avec ou sans interface graphique
* Une installation de [node][nodejs]

### Comment mettre en place votre dépôt (que vous vouliez contribuer ou non)

Les instructions sont données en ligne de commande, mais si vous préférez les interfaces graphiques, vous pourrez facilement vous y retrouver.

Merci de noter que le script _bash_ / _bat_ intégré fonctionne avec des dossiers locaux baptisés `TW5dev` et `tiddlywiki5`. Vous devrez modifier ces scripts si vous voulez les utiliser avec vos propres nom de dossiers.

* **Vous voudrez peut-être forker** depuis l'un des principaux dépôts publics du projet. Vous y trouverez un bouton dédié si vous avez un compte là-bas :
  * [framagit][framagit] (instance gitlab)
  * [gitlab][gitlab]
  * [github][github]

Cela créera un dépôt à vous, lié au dépôt TiddlyWiki-Plugins principal qui sera votre camp de base.

* **Clonez le dépôt sur votre machine**
  * Depuis votre dépôt, puis définissez le dépôt principal comme _upstream_
```
git clone https://your_git_provider/user_name/your_repo_name.git TW5dev
git remote add upstream https://framagit.org/sycom/TiddlyWiki-Plugins.git
```

  * Ou directement depuis le dépôt principal en le définissant comme _upstream_
```
git clone https://framagit.org/sycom/TiddlyWiki-Plugins.git -o upstream your_repo_name
```

* **Les bases pour travailler**
  Il vous faudra au choix (ou les deux)
  * une installation de TiddlyWiki dans node
```
npm install -g tiddlywiki
```
  * une copie du dépôt principal de tiddlywiki
```
git clone https://github.com/Jermolene/TiddlyWiki5.git -o upstream tiddlywiki5
```

### **Travaillez, testez votre travail**
  Une fois que vous avez fait des modifications, vous avez plein de choix et pouvez utiliser le script `tw.bat` (pas de `tw.sh` pour l'instant)

* Utiliser **l'installation nodejs** de tiddlywiki
  * en version serveur _fichiers tid / node_ (sur http://127.0.0.1:8080)
    ```
    tiddlywiki ./edition/your_edition
    ```
    ou
    ```
    tw your_edition
    ```
  * construction d'un fichier TiddlyWiki _index.html_ (dans [.editions/your_edition/output](#)
    ```
    tiddlywiki ./edition/your_edition --build
    ```
    ou
    ```
    tw your_edition build
    ```
* Utiliser **une copie locale du dépôt TiddlyWiki** officiel
  * en version serveur _fichiers tid / node_ (sur http://127.0.0.1:8080)
    ```
    node ../tiddlywiki5/tiddlywiki.js ../TW5dev/editions/your_edition
    ```
    ou
    ```
    tw -l your_edition
    ```
  * construction d'un fichier TiddlyWiki _index.html_ (dans [.editions/your_edition/output](#))
    ```
    node ../tiddlywiki5/tiddlywiki.js ../TW5dev/editions/your_edition --build
    ```
    ou
    ```
    tw -l your_edition build
    ```   

Quand vous serez content de votre production, l'ensemble de la communauté TiddlyWiki sera très heureuse d'en entendre parler. Venir en parler sur le [groupe][group] (ou le [forum français][fr_group]) est surement la façon la plus rapide et efficace.

### Propositions d'intégration

Si vous avez des propositions d'intégration de votre code (_merge request_) (c'est chouette ! Merci), merci de le faire via le dépôt [framagit][framagit]. Gérer plus d'un dépôt principal serait plutôt compliqué.

Joyeuses contributions !

[en-GB]: ../../../../CONTRIBUTING.md

[git]: https://git-scm.com/
[nodejs]: https://nodejs.org

[issues]: https://framagit.org/sycom/TiddlyWiki-Plugins/issues
[group]: https://groups.google.com/forum/#!forum/tiddlywiki
[fr_group]: https://forum.tiddlywiki.fr/

[demo]: https://sycom.frama.io/TiddlyWiki-Plugins
[framagit]: https://framagit.org/sycom/TiddlyWiki-Plugins
[gitlab]: https://gitlab.com/sycom/TiddlyWiki-Plugins
[github]: https://github.com/sycom/TiddlyWiki-Plugins
