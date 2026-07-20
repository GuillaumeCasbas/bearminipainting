Je souhaite créer une application pour m'aider à organiser et tracker les actions de la peinture de mes armées warhammer.

Je souhaite pouvoir créer des projets, chaque projet contient des unités à peindre

Un projet comprend un nom, un code (exemple: NMS)

Une unité comprends un nom, un code (exemple: AA-01, IA-01), et un projet rataché
  Le code d'une unité sera focément préfixé par le code du projet: pour une projet avec code `123`, et une unité avec code `ABC-01`, le code final sera `123-ABC-01`

Chaque unité va avoir par défaut ces 6 todos (toujours identiques) :
- Montage
- Sous-couche
- Base
- Effets
- Socle
- Vernis
Il doit être possible d'ajouter des todo spécifique pour une unité

La vue liste des projet
- Affiche les projets avec le taux de completion (correspond à la somme des taches terminées vs à faire des différentes unités)
- Affiche un bouton pour amener à la création d'un projet

La vue détail du projet
- Affiche le taux de completion (correspond à la somme des taches terminées vs à faire des différentes unités)
- Affiche la liste des unités: le code, le nom, le taux de completion (corresponse au nombre de tache réalisées sur celle pas encore complétés)
- Affiche un bouton pour amener à la création d'une unité au sein de ce projet

La vue détail d'une unité
- Affiche le code, le nom, le taux de completion (corresponse au nombre de tache réalisées sur celle pas encore complétés)
- Affiche les taches restant à faire en premier, et les tache fait en second, grisé
- Il est possible de cocher / décocher une tache pour changer son état
- Affiche un bouton permettant de modifier une unité
