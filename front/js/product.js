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

async function displayArticle(productId) {
    const article = await getArticle(productId);

    const productImg = document.createElement("img");
    document.querySelector(".item__img").appendChild(productImg);
    productImg.src = article.imageUrl;
    productImg.alt = article.altTxt;

}
displayArticle(productId);