/* =====================================================
   HuyMobilePhone
   CART.JS
   Quản lý toàn bộ giỏ hàng
===================================================== */

console.log("✅ CART.JS ĐÃ ĐƯỢC LOAD");


/* =====================================================
   1. LẤY GIỎ HÀNG
===================================================== */

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    } catch (error) {

        console.error(
            "Lỗi đọc giỏ hàng:",
            error
        );

        return [];

    }

}


/* =====================================================
   2. LƯU GIỎ HÀNG
===================================================== */

function saveCart(cart) {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


/* =====================================================
   3. CẬP NHẬT SỐ LƯỢNG ICON
===================================================== */

function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");


    if (!cartCount) {
        return;
    }


    const cart =
        getCart();


    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + Number(item.quantity),
            0
        );


    cartCount.textContent =
        totalQuantity;

}


/* =====================================================
   4. THÊM SẢN PHẨM
===================================================== */

function addToCart(id) {

    const product =
        products.find(
            product =>
                product.id === id
        );


    if (!product) {

        alert(
            "Không tìm thấy sản phẩm!"
        );

        return;

    }


    const cart =
        getCart();


    const existingProduct =
        cart.find(
            item =>
                item.id === id
        );


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: Number(product.price),

            image: product.image,

            quantity: 1

        });

    }


    saveCart(cart);

    updateCartCount();

    showCartMessage(product.name);

}


/* =====================================================
   5. THÔNG BÁO
===================================================== */

function showCartMessage(productName) {

    const oldMessage =
        document.getElementById("cartMessage");


    if (oldMessage) {
        oldMessage.remove();
    }


    const message =
        document.createElement("div");


    message.id = "cartMessage";


    message.innerHTML = `

        <i class="bi bi-check-circle-fill"></i>

        Đã thêm
        <strong>${productName}</strong>
        vào giỏ hàng.

    `;


    message.style.position = "fixed";
    message.style.top = "90px";
    message.style.right = "20px";
    message.style.zIndex = "9999";
    message.style.background = "#198754";
    message.style.color = "#ffffff";
    message.style.padding = "13px 18px";
    message.style.borderRadius = "8px";
    message.style.boxShadow =
        "0 5px 20px rgba(0,0,0,0.2)";


    document.body.appendChild(message);


    setTimeout(
        function() {

            if (message) {
                message.remove();
            }

        },
        2500
    );

}


/* =====================================================
   6. HIỂN THỊ GIỎ HÀNG
===================================================== */

function displayCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");


    if (!cartItems) {
        return;
    }


    const cart =
        getCart();


    cartItems.innerHTML = "";


    // ==============================
    // GIỎ TRỐNG
    // ==============================

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="text-center py-4">

                <i
                    class="
                        bi
                        bi-cart-x
                        display-5
                        text-secondary
                    "
                ></i>

                <p class="mt-3 mb-0">

                    Giỏ hàng đang trống.

                </p>

            </div>

        `;


        if (cartTotal) {

            cartTotal.textContent = "0đ";

        }


        return;

    }


    // ==============================
    // HIỂN THỊ SẢN PHẨM
    // ==============================

    let total = 0;


    cart.forEach(item => {

        const price =
            Number(item.price);


        const quantity =
            Number(item.quantity);


        const itemTotal =
            price * quantity;


        total += itemTotal;


        const itemHTML = `

            <div
                class="
                    d-flex
                    align-items-center
                    gap-3
                    mb-3
                    pb-3
                    border-bottom
                "
            >

                <img
                    src="${item.image}"
                    alt="${item.name}"
                    style="
                        width: 80px;
                        height: 80px;
                        object-fit: contain;
                    "
                >


                <div class="flex-grow-1">

                    <h6 class="mb-1">

                        ${item.name}

                    </h6>


                    <div
                        class="
                            text-danger
                            fw-bold
                        "
                    >

                        ${price.toLocaleString("vi-VN")}đ

                    </div>


                    <div
                        class="
                            d-flex
                            align-items-center
                            mt-2
                        "
                    >

                        <button
                            type="button"
                            class="
                                btn
                                btn-sm
                                btn-outline-secondary
                            "
                            onclick="
                                decreaseQuantity(${item.id})
                            "
                        >

                            −

                        </button>


                        <span class="mx-3">

                            ${quantity}

                        </span>


                        <button
                            type="button"
                            class="
                                btn
                                btn-sm
                                btn-outline-secondary
                            "
                            onclick="
                                increaseQuantity(${item.id})
                            "
                        >

                            +

                        </button>

                    </div>

                </div>


                <button
                    type="button"
                    class="
                        btn
                        btn-sm
                        btn-outline-danger
                    "
                    onclick="
                        removeFromCart(${item.id})
                    "
                >

                    <i class="bi bi-trash"></i>

                </button>

            </div>

        `;


        cartItems.insertAdjacentHTML(
            "beforeend",
            itemHTML
        );

    });


    if (cartTotal) {

        cartTotal.textContent =
            total.toLocaleString("vi-VN") + "đ";

    }

}


/* =====================================================
   7. TĂNG SỐ LƯỢNG
===================================================== */

function increaseQuantity(id) {

    const cart =
        getCart();


    const item =
        cart.find(
            item =>
                item.id === id
        );


    if (!item) {
        return;
    }


    item.quantity++;


    saveCart(cart);

    displayCart();

    updateCartCount();

}


/* =====================================================
   8. GIẢM SỐ LƯỢNG
===================================================== */

function decreaseQuantity(id) {

    let cart =
        getCart();


    const item =
        cart.find(
            item =>
                item.id === id
        );


    if (!item) {
        return;
    }


    item.quantity--;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item =>
                    item.id !== id
            );

    }


    saveCart(cart);

    displayCart();

    updateCartCount();

}


/* =====================================================
   9. XÓA SẢN PHẨM
===================================================== */

function removeFromCart(id) {

    let cart =
        getCart();


    cart =
        cart.filter(
            item =>
                item.id !== id
        );


    saveCart(cart);

    displayCart();

    updateCartCount();

}


/* =====================================================
   10. MỞ GIỎ HÀNG
===================================================== */

function openCart() {

    const cartModalElement =
        document.getElementById("cartModal");


    if (!cartModalElement) {
        return;
    }


    displayCart();


    const cartModal =
        bootstrap.Modal.getOrCreateInstance(
            cartModalElement
        );


    cartModal.show();

}


/* =====================================================
   11. KHỞI ĐỘNG
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();


        const cartButton =
            document.getElementById("cartButton");


        if (cartButton) {

            cartButton.addEventListener(
                "click",
                openCart
            );

        }

    }
);