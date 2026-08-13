/* =====================================================
   HuyMobilePhone
   SCRIPT.JS
   Quản lý sản phẩm, tìm kiếm, lọc, sắp xếp
   và trạng thái đăng nhập
===================================================== */


/* =====================================================
   1. DANH SÁCH SẢN PHẨM
===================================================== */

const products = [

    // =========================
    // APPLE
    // =========================

    {
        id: 1,
        name: "iPhone 16 Pro",
        brand: "Apple",
        price: 27990000,
        oldPrice: 29990000,
        image: "images/iphone-16-pro.png"
    },

    {
        id: 2,
        name: "iPhone 16",
        brand: "Apple",
        price: 21990000,
        oldPrice: 22990000,
        image: "images/iphone-16.png"
    },

    {
        id: 3,
        name: "iPhone 15 Pro",
        brand: "Apple",
        price: 24990000,
        oldPrice: 27990000,
        image: "images/iphone-15-pro.png"
    },

    {
        id: 4,
        name: "iPhone 15",
        brand: "Apple",
        price: 18990000,
        oldPrice: 20990000,
        image: "images/iphone-15.png"
    },


    // =========================
    // SAMSUNG
    // =========================

    {
        id: 5,
        name: "Samsung Galaxy S25 Ultra",
        brand: "Samsung",
        price: 33990000,
        oldPrice: 36990000,
        image: "images/samsung-s25-ultra.png"
    },

    {
        id: 6,
        name: "Samsung Galaxy S25+",
        brand: "Samsung",
        price: 26990000,
        oldPrice: 28990000,
        image: "images/samsung-s25-plus.png"
    },

    {
        id: 7,
        name: "Samsung Galaxy S25",
        brand: "Samsung",
        price: 22990000,
        oldPrice: 24990000,
        image: "images/samsung-s25.png"
    },

    {
        id: 8,
        name: "Samsung Galaxy A56",
        brand: "Samsung",
        price: 10990000,
        oldPrice: 11990000,
        image: "images/samsung-a56.png"
    },


    // =========================
    // XIAOMI
    // =========================

    {
        id: 9,
        name: "Xiaomi 15 Ultra",
        brand: "Xiaomi",
        price: 29990000,
        oldPrice: 31990000,
        image: "images/xiaomi-15-ultra.png"
    },

    {
        id: 10,
        name: "Xiaomi 15",
        brand: "Xiaomi",
        price: 19990000,
        oldPrice: 21990000,
        image: "images/xiaomi-15.png"
    },

    {
        id: 11,
        name: "Redmi Note 14 Pro",
        brand: "Xiaomi",
        price: 8990000,
        oldPrice: 9990000,
        image: "images/xiaomi-redmi-note-14-pro.png"
    },

    {
        id: 12,
        name: "POCO X7",
        brand: "Xiaomi",
        price: 7490000,
        oldPrice: 8490000,
        image: "images/xiaomi-poco-x7.png"
    },


    // =========================
    // OPPO
    // =========================

    {
        id: 13,
        name: "OPPO Find X8 Pro",
        brand: "OPPO",
        price: 24990000,
        oldPrice: 26990000,
        image: "images/oppo-find-x8-pro.png"
    },

    {
        id: 14,
        name: "OPPO Find X8",
        brand: "OPPO",
        price: 19990000,
        oldPrice: 21990000,
        image: "images/oppo-find-x8.png"
    },

    {
        id: 15,
        name: "OPPO Reno13 Pro",
        brand: "OPPO",
        price: 15990000,
        oldPrice: 17990000,
        image: "images/oppo-reno-13-pro.png"
    },

    {
        id: 16,
        name: "OPPO Reno13",
        brand: "OPPO",
        price: 12990000,
        oldPrice: 13990000,
        image: "images/oppo-reno-13.png"
    }

];


/* =====================================================
   2. LẤY CÁC PHẦN TỬ HTML
===================================================== */

const productList =
    document.getElementById("productList");

const noResult =
    document.getElementById("noResult");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const sortSelect =
    document.getElementById("sortSelect");


/* =====================================================
   3. ĐỊNH DẠNG TIỀN
===================================================== */

function formatPrice(price) {

    return Number(price).toLocaleString("vi-VN") + "đ";

}


/* =====================================================
   4. HIỂN THỊ SẢN PHẨM
===================================================== */

function displayProducts(productArray) {

    if (!productList) {
        return;
    }

    productList.innerHTML = "";


    // Không có sản phẩm

    if (productArray.length === 0) {

        if (noResult) {
            noResult.classList.remove("d-none");
        }

        return;

    }


    if (noResult) {
        noResult.classList.add("d-none");
    }


    productArray.forEach(product => {

        const discount =
            Math.round(
                (
                    (product.oldPrice - product.price)
                    / product.oldPrice
                ) * 100
            );


        const productHTML = `

            <div class="col-6 col-md-4 col-lg-3">

                <div class="product-card">

                    <!-- ẢNH -->

                    <div class="product-image">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >

                    </div>


                    <!-- THÔNG TIN -->

                    <div class="product-info">

                        <div class="product-brand">

                            ${product.brand}

                        </div>


                        <div class="product-name">

                            ${product.name}

                        </div>


                        <div>

                            <span class="product-price">

                                ${formatPrice(product.price)}

                            </span>


                            <span class="product-old-price">

                                ${formatPrice(product.oldPrice)}

                            </span>

                        </div>


                        <div class="mt-2">

                            <span class="badge bg-danger">

                                -${discount}%

                            </span>

                        </div>


                        <button
                            class="
                                btn
                                btn-primary
                                buy-button
                            "
                            type="button"
                            onclick="addToCart(${product.id})"
                        >

                            <i class="bi bi-cart-plus"></i>

                            Thêm vào giỏ

                        </button>

                    </div>

                </div>

            </div>

        `;


        productList.insertAdjacentHTML(
            "beforeend",
            productHTML
        );

    });

}


/* =====================================================
   5. TÌM KIẾM
===================================================== */

function searchProducts() {

    if (!searchInput) {
        return;
    }


    const keyword =
        searchInput.value
            .trim()
            .toLowerCase();


    const result =
        products.filter(product => {

            return (

                product.name
                    .toLowerCase()
                    .includes(keyword)

                ||

                product.brand
                    .toLowerCase()
                    .includes(keyword)

            );

        });


    displayProducts(result);


    if (
        keyword !== "" &&
        document.getElementById("products")
    ) {

        document
            .getElementById("products")
            .scrollIntoView({
                behavior: "smooth"
            });

    }

}


/* =====================================================
   6. SỰ KIỆN TÌM KIẾM
===================================================== */

if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchProducts
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                searchProducts();

            }

        }
    );

}


/* =====================================================
   7. LỌC THEO THƯƠNG HIỆU
===================================================== */

const brandButtons =
    document.querySelectorAll(".brand-card");


brandButtons.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            const brand =
                this.dataset.brand;


            const result =
                products.filter(product => {

                    return product.brand === brand;

                });


            displayProducts(result);


            const productSection =
                document.getElementById("products");


            if (productSection) {

                productSection.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

});


/* =====================================================
   8. SẮP XẾP GIÁ
===================================================== */

if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        function() {

            const value =
                this.value;


            let result =
                [...products];


            if (value === "low") {

                result.sort(
                    (a, b) =>
                        a.price - b.price
                );

            }


            if (value === "high") {

                result.sort(
                    (a, b) =>
                        b.price - a.price
                );

            }


            displayProducts(result);

        }
    );

}


/* =====================================================
   9. TRẠNG THÁI ĐĂNG NHẬP
===================================================== */

function updateUserMenu() {

    const userMenu =
        document.getElementById("userMenu");


    if (!userMenu) {
        return;
    }


    const userData =
        localStorage.getItem("user");


    // ==============================
    // CHƯA ĐĂNG NHẬP
    // ==============================

    if (!userData) {

        userMenu.innerHTML = `

            <a
                href="login.html"
                class="btn btn-outline-light"
            >

                <i class="bi bi-person"></i>

                Đăng nhập

            </a>

        `;

        return;

    }


    // ==============================
    // ĐÃ ĐĂNG NHẬP
    // ==============================

    try {

        const user =
            JSON.parse(userData);


        userMenu.innerHTML = `

            <div class="dropdown">

                <button
                    class="btn btn-outline-light dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                >

                    <i class="bi bi-person-circle"></i>

                    Xin chào,
                    ${user.name}

                </button>


                <ul class="dropdown-menu dropdown-menu-end">

    <li>
        <a
    class="dropdown-item"
    href="account.html"
>
    <i class="bi bi-person"></i>
    Tài khoản
</a>
    </li>

    <li>
        <a
            class="dropdown-item"
            href="orders.html"
        >
            <i class="bi bi-receipt"></i>
            Đơn hàng
        </a>
    </li>

    <li>
        <hr class="dropdown-divider">
    </li>

    <li>
        <button
            class="dropdown-item text-danger"
            type="button"
            id="logoutButton"
        >
            <i class="bi bi-box-arrow-right"></i>
            Đăng xuất
        </button>
    </li>

</ul>

            </div>

        `;


        const logoutButton =
            document.getElementById("logoutButton");


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function() {

                    localStorage.removeItem("user");

                    window.location.reload();

                }
            );

        }


    } catch (error) {

        console.error(
            "Không thể đọc thông tin người dùng:",
            error
        );


        localStorage.removeItem("user");

        updateUserMenu();

    }

}


/* =====================================================
   10. KHỞI ĐỘNG
===================================================== */

displayProducts(products);

updateUserMenu();