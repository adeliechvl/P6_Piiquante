const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true }, // L'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
    name: { type: String, required: true }, // Nom de la sauce
    manufacturer: { type: String, required: true }, // Fabricant de la sauce
    description: { type: String, required: true }, // Description de la sauce
    mainPepper: { type: String, required: true }, // Le principal ingrédient épicé de la sauce
    imageUrl: { type: String, required: true }, // L'URL de l'image de la sauce téléchargée par l'utilisateur
    heat: { type: Number, required: true }, // Nombre de 1 à 10 décrivant la sauce
    likes: { type: Number, required: true }, // Nombre d'utilisateurs qui aiment (= likent) la sauce
    dislikes: { type: Number, required: true }, // Nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce    
    usersLiked: { type: [String], required: true }, // Tableau des identifiants des utilisateurs qui ont aimé (= liked) la sauce
    usersDisliked: { type: [String], required: true }, // Tableau des identifiants des utilisateurs qui n'ont pas aimé (= disliked) la sauce
});

module.exports = mongoose.model('Sauce', sauceSchema);