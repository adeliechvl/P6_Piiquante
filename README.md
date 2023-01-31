# HotTakes

Projet n°6 - Construire une API sécurisée pour une application d'avis gastronomiques

## Objectifs

Développer le back-end d'une application web de critiques des sauces piquantes appelée "Hot Takes" pour la marque de condiments à base de piment "Piiquante". Le front-end est déjà fourni, il ne faut pas le modifier.

Réaliser une galerie des sauces permettant aux utilisateurs de télécharger leurs sauces piquantes préférées et de liker ou disliker les sauces que d'autres partagent.

Implémenter des techniques de sécurité : sécuriser les mots de passe des utilisateurs

## Langages et frameworks uilisés 

Développement back-end réalisé avec JavaScript, serveur Node.js. Utilisation du framework Express. Utilisation de la base de données MongoDB. Plug-in Mongoose.

## Lancer l'application

1 - Dans un nouvel espace de travail créez un dossier frontend et un autre dossier backend.

2 - Dans le dossier frontend :
-> Clonez le repository de cette adresse : https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6.
-> Dans le terminal du frontend installez Node.js, Angular CLI, node-sass
-> Lancez le terminal du frontend avec "run npm install" puis "ng serve"
-> Le frontend se lancera normalement à cette adresse "http://localhost:4200"

3 - Dans le dossier backend :
-> Dans le terminal du backend installez Nodemon
-> Lancez le serveur avec "nodemon server"
-> Les informations du backend se trouverons à cette adresse : "http://localhost:3000"

## Mesures de sécurités mises en place

-> Hashage du mot de passe utilisateur avec "bcrypt"
-> Vérification que l'adresse email de l'utilisateur est unique dans la base de données avec "mongoose-unique-validator"
-> Vérification de l'authentification de l'utilisateur avec un token avec "jsonwebtoken"
-> Base de donnée sécurisée avec "mongoose"
-> Création de variable d'environnement pour protéger les données sensibles des utilisateurs avec "dotenv"