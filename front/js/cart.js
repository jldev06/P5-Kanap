// Gestion du panier


// Mise à disposition des éléments à appeler pour la boucle d'affichage des produits sélectionnés

const LOCALSTORAGE = JSON.parse(localStorage.getItem("userProducts"));
const PRODUCTS_URL = "http://localhost:3000/api/products/";

// Identification des balises d'affichage

const displayCard = document.getElementById("cart__items");
const displayQty = document.getElementsByClassName("itemQuantity");

// déclaration des variables à utiliser - fonction displayTotal

let sumPrice = [];
let totalQuantity = [];

// Appel de l'API pour rendre disponible la liste des produits

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

// Fonction d'affichage des produits dans le panier

async function displayBasket() {
    // Si LOCALSTORAGE contient des éléments, on effectue une boucle pour afficher les informations des produits concernés

    if (LOCALSTORAGE !== null) {
        for (let product of LOCALSTORAGE) {
            // récupération des données  complémentaires des produits dans l'API

            const article = await getArticle(product.userProductId);

            // déclaration dans des variables des données receuillies dans le local storage et l'API

            let userProductChoiceId = article._id;
            let userProductChoiceColor = product.userProductColor;
            let userProductChoiceImg = article.imageUrl;
            let userProductChoiceImgAlt = article.altTxt;
            let userProductChoiceName = article.name;
            let userProductChoicePrice = article.price;
            let userProductChoiceQuantity = product.userProductQty;

            // Création des éléments HTML pour l'affichage des produits

            // Article

            const productCard = document.createElement("article");
            displayCard.appendChild(productCard);
            productCard.classList = "cart__item";
            productCard.dataset.id = userProductChoiceId;
            productCard.dataset.color = userProductChoiceColor;

            // div Image

            const productCardImgContainer = document.createElement("div");
            productCard.appendChild(productCardImgContainer);
            productCardImgContainer.classList = "cart__item__img";

            // Image

            const productCardImg = document.createElement("img");
            productCardImgContainer.appendChild(productCardImg);
            productCardImg.src = userProductChoiceImg;
            productCardImg.alt = userProductChoiceImgAlt;

            // div Content

            const productCardContent = document.createElement("div");
            productCard.appendChild(productCardContent);
            productCardContent.classList = "cart__item__content";

            // div Content Description

            const productCardContentDescription = document.createElement("div");
            productCardContent.appendChild(productCardContentDescription);
            productCardContentDescription.classList =
                "cart__item__content__description";

            // Titre h2 - Nom du produit

            const productCardContentName = document.createElement("h2");
            productCardContentDescription.appendChild(productCardContentName);
            productCardContentName.innerHTML = userProductChoiceName;

            // Paragraphe - Couleur du produit

            const productCardContentColor = document.createElement("p");
            productCardContentDescription.appendChild(productCardContentColor);
            productCardContentColor.innerHTML = userProductChoiceColor;

            // Paragraphe - Prix du produit

            const productCardContentPrice = document.createElement("p");
            productCardContentDescription.appendChild(productCardContentPrice);
            productCardContentPrice.classList =
                "cart__item__content__description__price";
            productCardContentPrice.dataset.price = userProductChoicePrice;
            productCardContentPrice.innerHTML = userProductChoicePrice + " €";

            // div Content Settings

            const productCardSettings = document.createElement("div");
            productCard.appendChild(productCardSettings);
            productCardSettings.classList = "cart__item__content__settings";

            // div Content Quantity

            const productCardSettingsQuantity = document.createElement("div");
            productCardSettings.appendChild(productCardSettingsQuantity);
            productCardSettingsQuantity.classList =
                "cart__item__content__settings__quantity";

            // Paragraphe "Qté :""

            const productCardSettingsQuantityTitle = document.createElement("p");
            productCardSettingsQuantity.appendChild(productCardSettingsQuantityTitle);
            productCardSettingsQuantityTitle.textContent = "Qté : ";

            // entrée des données pour la quantité

            const productCardSettingsQuantityInput = document.createElement("input");
            productCardSettingsQuantity.appendChild(productCardSettingsQuantityInput);
            productCardSettingsQuantityInput.setAttribute("type", "number");
            productCardSettingsQuantityInput.classList = "itemQuantity";
            productCardSettingsQuantityInput.setAttribute("name", "itemQuantity");
            productCardSettingsQuantityInput.setAttribute("min", "1");
            productCardSettingsQuantityInput.setAttribute("max", "100");
            productCardSettingsQuantityInput.setAttribute("value", userProductChoiceQuantity);

            // div Delete

            const productCardDeleteContainer = document.createElement("div");
            productCardSettings.appendChild(productCardDeleteContainer);
            productCardDeleteContainer.classList = "cart__item__content__settings__delete";

            // p delete button

            const productCardDeleteButton = document.createElement("p");
            productCardDeleteContainer.appendChild(productCardDeleteButton);
            productCardDeleteButton.classList = "deleteItem";
            productCardDeleteButton.textContent = "Supprimer";

            // Calcul des totaux

            evalTotal(userProductChoiceQuantity, userProductChoicePrice);
        }
    } else {
        // Messages affichés si le panier est vide

        const productCardEmpty = document.createElement("p");
        displayCard.appendChild(productCardEmpty);
        productCardEmpty.textContent = "Votre panier est vide";

        const totalPriceSpan = document.getElementById("totalPrice");
        totalPriceSpan.textContent = 0;

        const totalQuantitySpan = document.getElementById("totalQuantity");
        totalQuantitySpan.textContent = 0;
    }
    changeTotal();
    removeItems();
}
displayBasket();

// Stockage du prix de chaque produit en fonction de sa quantités et stockage de la quantité

function evalTotal(Qty, Price) {
    let totalPrice = Qty * Price;
    sumPrice.push(totalPrice);

    totalQuantity.push(Number(Qty));

    displayTotal(sumPrice, totalQuantity);
}

// affichage des totaux (utilisation méthode reduce)

function displayTotal(sumPrice, totalQuantity) {
    sumPrice = sumPrice.reduce((a, b) => a + b);
    totalQuantity = totalQuantity.reduce((a, b) => a + b);

    const totalPriceSpan = document.getElementById("totalPrice");
    totalPriceSpan.dataset.price = sumPrice;
    totalPriceSpan.textContent = sumPrice;

    const totalQuantitySpan = document.getElementById("totalQuantity");
    totalQuantitySpan.dataset.qty = totalQuantity;
    totalQuantitySpan.textContent = totalQuantity;
}

// Changement des totaux

function changeTotal() {
    //gestion des entrées de données pour la quantité

    const inputQuantity = document.querySelectorAll(".itemQuantity");

    for (let i = 0; i < inputQuantity.length; i++) {
        let self = inputQuantity[i];
        const target = self.closest("article");
        const targetPrice = document.querySelectorAll(
            "#cart__items > article > div.cart__item__content > div > p.cart__item__content__description__price"
        );

        // gestion des autres entrées de données

        self.addEventListener("change", async function() {
            let changingProductid = target.dataset.id;
            let changingProductColor = target.dataset.color;
            let newQty = self.value;

            for (product of LOCALSTORAGE) {
                const article = await getArticle(product.userProductId);
                if (
                    changingProductid === product.userProductId &&
                    changingProductColor === product.userProductColor
                ) {
                    product.userProductQty = newQty;
                    if (newQty != 0) {
                        localStorage.setItem("userProducts", JSON.stringify(LOCALSTORAGE));

                        let sumArray = [];
                        let sumProduct = 0;

                        let qtyArray = [];

                        for (product of LOCALSTORAGE) {
                            sumProduct = article.price * product.userProductQty;
                            sumArray.push(sumProduct);
                            qtyArray.push(Number(product.userProductQty));
                        }

                        //utilisation de la méthode reduce et affichage sur la page panier du resultat

                        sumArray = sumArray.reduce((a, b) => a + b);
                        qtyArray = qtyArray.reduce((a, b) => a + b);

                        const totalPriceSpan = document.getElementById("totalPrice");
                        totalPriceSpan.dataset.price = sumArray;
                        totalPriceSpan.textContent = sumArray;

                        const totalQuantitySpan = document.getElementById("totalQuantity");
                        totalQuantitySpan.dataset.qty = qtyArray;
                        totalQuantitySpan.textContent = qtyArray;
                    } else if (newQty == 0) {
                        LOCALSTORAGE.splice(LOCALSTORAGE.indexOf(product), 1)
                        localStorage.setItem("userProducts", JSON.stringify(LOCALSTORAGE))
                        location.reload();
                    } else {
                        alert("Votre panier est vide")
                    }
                }
            }
        });
    }
};

// Suppression dans le panier d'un produit sélectionné 

function removeItems() {
    const deleteProduct = document.querySelectorAll(".deleteItem");

    for (let i = 0; i < deleteProduct.length; i++) {
        let self = deleteProduct[i];
        let target = self.closest("article");

        deleteProduct[i].addEventListener("click", () => {
            let deleteProductid = target.dataset.id;
            let deleteProductColor = target.dataset.color;

            for (product of LOCALSTORAGE) {
                if (
                    deleteProductid === product.userProductId &&
                    deleteProductColor === product.userProductColor
                ) {
                    LOCALSTORAGE.splice(i, 1);
                    localStorage.setItem("userProducts", JSON.stringify(LOCALSTORAGE));
                    if (LOCALSTORAGE.length === 0) {
                        localStorage.removeItem("userProducts");
                        window.location.reload();
                    } else {
                        window.location.reload();
                    }
                }
            }
        });
    }
}

// gestion du formulaire