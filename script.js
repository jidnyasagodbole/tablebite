let cart = [];


/* =========================
   GET TABLE NUMBER FROM URL
========================= */

const urlParams =
    new URLSearchParams(window.location.search);

const tableNumber =
    urlParams.get("table") || "07";


/* =========================
   SHOW TABLE NUMBER
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const tableInfo =
        document.querySelector(".table-info");

    if (tableInfo) 

        tableInfo.textContent =
            "Table " + tableNumber;

    }

);


/* =========================
   ADD TO CART
========================= */


    function addToCart(name, price) {

    const existingItem =
        cart.find(item => item.name === name);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            name: name,

            price: price,

            quantity: 1

        });

    }

    updateCart();

    showToast(name);

}
function showToast(itemName) {

    const toast =
        document.getElementById("toastNotification");

    const message =
        document.getElementById("toastMessage");

    message.textContent =
        itemName + " has been added to your order";

    toast.classList.add("show");

    setTimeout(function () {

        toast.classList.remove("show");

    }, 2000);

}

/* =========================
   UPDATE CART
========================= */

function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");

    cartItems.innerHTML = "";

    let total = 0;

    let count = 0;


    cart.forEach((item, index) => {

        total +=
            item.price * item.quantity;

        count +=
            item.quantity;


        const div =
            document.createElement("div");

        div.className =
            "cart-item";


        div.innerHTML = `

            <div>

                <strong>
                    ${item.name}
                </strong>

                <br>

                <small>
                    ₹${item.price} × ${item.quantity}
                </small>

            </div>


            <div>

                ₹${item.price * item.quantity}

                <br>

                <button
                    onclick="removeItem(${index})"
                >
                    Remove
                </button>

            </div>

        `;


        cartItems.appendChild(div);

    });


    cartCount.textContent =
        count;

    cartTotal.textContent =
        total;

}


/* =========================
   REMOVE ITEM
========================= */

function removeItem(index) {

    cart.splice(index, 1);

    updateCart();

}


/* =========================
   OPEN CART
========================= */

function openCart() {

    document
        .getElementById("cartPanel")
        .classList.add("open");

}


/* =========================
   CLOSE CART
========================= */

function closeCart() {

    document
        .getElementById("cartPanel")
        .classList.remove("open");

}


/* =========================
   PLACE ORDER
========================= */

async function placeOrder() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    let total = 0;


    cart.forEach(item => {

        total +=
            item.price *
            item.quantity;

    });


    const orderData = {

        table: tableNumber,

        items: cart,

        total: total

    };


    try {

        const response = await fetch(

            "https://tablebite-backend.onrender.com/api/orders",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(orderData)

            }

        );


        const data =
            await response.json();


        if (data.success) {

            cart = [];

            updateCart();

            closeCart();


            /*
              OPEN CUSTOMER
              ORDER STATUS PAGE
            */

            window.location.href =
                "order-status.html?order=" +
                data.order.id +
                "&table=" +
                data.order.table;


        } else {

            alert(
                "Something went wrong while placing the order."
            );

        }


    } catch (error) {

        console.error(
            "Order Error:",
            error
        );


        alert(

            "Could not connect to TABLEBITE server.\n\n" +

            "Please make sure the backend is running."

        );

    }

}


/* =========================
   FILTER MENU
========================= */

function filterMenu(category) {

    const cards =
        document.querySelectorAll(
            ".food-card"
        );


    cards.forEach(card => {

        if (

            category === "all" ||

            card.dataset.category ===
                category

        ) {

            card.style.display =
                "block";

        } else {

            card.style.display =
                "none";

        }

    });

}


/* =========================
   SEARCH MENU
========================= */

function searchMenu() {

    const search =

        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase();


    const cards =

        document.querySelectorAll(
            ".food-card"
        );


    cards.forEach(card => {

        const name =

            card
                .querySelector("h3")
                .textContent
                .toLowerCase();


        if (
            name.includes(search)
        ) {

            card.style.display =
                "block";

        } else {

            card.style.display =
                "none";

        }

    });

}
