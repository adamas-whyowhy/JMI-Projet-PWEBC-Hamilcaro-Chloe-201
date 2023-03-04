# JMI-Projet-PWEBC-Hamilcaro-Chloe-201

Projet réalisé dans un cadre universitaire. Objectif : manipuler une carte interactive grâce à Leaflet, sujet libre.
Cette application web propose un "jeu" dont le but est de situer les stations de transport en commun d'Île-de-France sur une carte interactive.

Pour installer ce projet :
- s'assurer d'avoir Symfony sur son ordinateur
- modifier l'avant-dernière ligne du fichier .env :
  DATABASE_URL="mysql://root@localhost:3306/pwebmapproject?serverVersion=5.7" root devient votreid:votremdp et pwebmapproject le nom de la base de données
- créer la base de données avec le nom que vous avez choisi dans le fichier .env
- importer les données dans la base de données grâce au fichier pwebmapproject.sql

Mot de passe de l'utilisateur principal : MAP123
