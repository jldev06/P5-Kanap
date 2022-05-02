// récupération  des données du produit séletionné sur la page d'acceuil

let urlId = new URL(window.location.href);
let productId = urlId.searchParams.get("id");

const productsUrl = "http://localhost:3000/api/products/";

async function getArticle(productId) {
    const catchArticle = await fetch(productsUrl + productId)
        .then((catchArticle) => catchArticle.json())
        .then(function(data) {
            article = data;
        })
    return (article);
}

// Affichage des détails du produit séletionné sur la page d'acceuil

async function displayArticle(productId) {
    const article = await getArticle(productId);

    const productImg = document.createElement("img");
    document.querySelector(".item__img").appendChild(productImg);
    productImg.src = article.imageUrl;
    productImg.alt = article.altTxt;

    const productTitle = document.getElementById("title");
    productTitle.innerHTML = article.name;

    const productPrice = document.getElementById("price");
    productPrice.innerHTML = article.price;

    const productDescription = document.getElementById("description");
    productDescription.innerHTML = article.description;


    for (color of article.colors) {
        const productColors = document.createElement("option");
        document.querySelector("#colors").appendChild(productColors);
        productColors.value = color;
        productColors.innerHTML = color;
    }
    addToCart();
}

displayArticle(productId);

function addToCart() {
    //Définition des champs à renseigner

    const addBtn = document.getElementById("addToCart");
    const quantity = document.getElementById("quantity");
    const color = document.getElementById("colors");

    addBtn.addEventListener("click", function() {
        if (color.value !== "" && quantity.value != 0 && quantity.value <= 100) {

            let userProductId = productId;
            let userProductColor = color.value;
            let userProductQty = quantity.value;
        } else {
            alert(
                "Pour enregistrer votre produit veuillez selectionner sa couleur et sa quantité"
            );
        }
    });
}