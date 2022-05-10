// Gestion de la confirmation.

//Récupération de l'identifiant  de commande dans l'URL
let urlId = new URL(window.location.href);
let productId = urlId.searchParams.get("id");

// Affichage de l'identifiant de commande
const userOrderId = document.querySelector('#orderId');
userOrderId.textContent = productId;

// Effacement des données stockées dans le localStorage
localStorage.removeItem('userProducts');