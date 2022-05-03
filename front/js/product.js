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

// Ajout des données au panier
function addToCart() {


    const addBtn = document.getElementById("addToCart");
    const quantity = document.getElementById("quantity");
    const color = document.getElementById("colors");



    addBtn.addEventListener("click", function() {
        if (color.value !== "" && quantity.value != 0 && quantity.value <= 100) {


            let userProductId = productId;
            let userProductColor = color.value;
            let userProductQty = quantity.value;

            // Création d'un array contenant id , couleur et quantité du produit

            let userProductArray = {
                userProductId: userProductId,
                userProductColor: userProductColor,
                userProductQty: userProductQty,
            };

            // Mise à disposition du localStorage si existant Json.parse prend la chaine de caractére et la retransforme en objet

            let productLocalStorage = JSON.parse(
                localStorage.getItem("userProducts")
            );

            // Comportement si il n'y a pas de localStorage (il n'a ni valeur ni type défini : donc null)

            if (productLocalStorage == null) {
                productLocalStorage = [];
                productLocalStorage.push(userProductArray);
                localStorage.setItem(
                    "userProducts",
                    JSON.stringify(productLocalStorage)
                );
                alert("C'est cool, le produit est enregistré");
            } else {
                // Comportement si il existe des données dans le localStorage

                // Condition si le produit comporte le même Id et la même couleur. Méthode find dans le localStorage et comparaison avec les valeurs de l'objet userProductArray

                let mappingProducts = productLocalStorage.find(
                    (el) =>
                    el.userProductId === userProductId &&
                    el.userProductColor === userProductColor
                );

                // Si la condition est vraie on additionne la quantité de l'objet du localStorage qui répond à la condition avec celle de la page en cours et on renvoie le tout au localStorage

                if (mappingProducts) {
                    // On incrémente la quantité

                    newQty =
                        parseInt(mappingProducts.userProductQty) + parseInt(userProductQty);
                    mappingProducts.userProductQty = newQty;

                    // On l'enregistre dans le localStorage json stringify prend l'objet et le transforme en chaîne de caractére

                    localStorage.setItem(
                        "userProducts",
                        JSON.stringify(productLocalStorage)
                    );
                    alert("le produit sélectionné est enregistré");
                } else {
                    // Dans tous les autres cas, on enregistre un nouvel objet dans le localStorage

                    productLocalStorage.push(userProductArray);
                    localStorage.setItem(
                        "userProducts",
                        JSON.stringify(productLocalStorage)
                    );
                    alert(" le produit sélectionné est enregistré");
                }
            }

            // Si la quantité et ou la couleur ne sont pas sélectioné correctement

        } else {
            alert(
                "Veuillez renseigner la couleur et la quantité du produit sélectionné"
            );
        }
    });
}