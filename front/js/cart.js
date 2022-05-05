// Mise à disposition des éléments à appeler pour la boucle d'affichage des produits sélectionnés

const LOCALSTORAGE = JSON.parse(localStorage.getItem("userProducts"));
const PRODUCTS_URL = "http://localhost:3000/api/products/";

// Identification des balises d'affichage

const displayCard = document.getElementById("cart__items");
const displayQty = document.getElementsByClassName("itemQuantity");

// Initialisation des variables à utiliser - fonction displayTotal

let sumPrice = [];
let totalQuantity = [];

// Appel de l'API pour rendre disponible la liste des articles

async function getArticle(productID) {
    const catchArticles = await fetch(PRODUCTS_URL + productID)
        .then((catchArticles) => catchArticles.json())
        .then(function(data) {
            article = data;
        })
        .catch(function(err) {
            console.log("Erreur fetch" + err);
        });
    return article;
}