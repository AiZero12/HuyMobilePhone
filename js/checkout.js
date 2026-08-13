/* =====================================================
   HuyMobilePhone
   CHECKOUT.JS
   Quản lý đặt hàng
===================================================== */

console.log("✅ CHECKOUT.JS ĐÃ ĐƯỢC LOAD");


/* =====================================================
   1. LẤY CÁC PHẦN TỬ
===================================================== */

const checkoutForm =
    document.getElementById("checkoutForm");

const checkoutButton =
    document.getElementById("checkoutButton");


/* =====================================================
   2. MỞ FORM ĐẶT HÀNG
===================================================== */

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        function() {

            // ==============================
            // KIỂM TRA ĐĂNG NHẬP
            // ==============================

            let user = null;


            try {

                user =
                    JSON.parse(
                        localStorage.getItem("user")
                    );

            } catch (error) {

                user = null;

            }


            if (!user) {

                alert(
                    "Bạn cần đăng nhập trước khi đặt hàng!"
                );


                window.location.href =
                    "login.html";


                return;

            }


            // ==============================
            // KIỂM TRA GIỎ HÀNG
            // ==============================

            const cart =
                typeof getCart === "function"
                    ? getCart()
                    : [];


            if (cart.length === 0) {

                alert(
                    "Giỏ hàng đang trống!"
                );

                return;

            }


            // ==============================
            // ĐÓNG GIỎ HÀNG
            // ==============================

            const cartModalElement =
                document.getElementById(
                    "cartModal"
                );


            if (cartModalElement) {

                const cartModal =
                    bootstrap.Modal.getInstance(
                        cartModalElement
                    );


                if (cartModal) {

                    cartModal.hide();

                }

            }


            // ==============================
            // MỞ FORM ĐẶT HÀNG
            // ==============================

            const checkoutModalElement =
                document.getElementById(
                    "checkoutModal"
                );


            if (!checkoutModalElement) {

                return;

            }


            const checkoutModal =
                bootstrap.Modal.getOrCreateInstance(
                    checkoutModalElement
                );


            checkoutModal.show();

        }
    );

}


/* =====================================================
   3. XÁC NHẬN ĐẶT HÀNG
===================================================== */

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // ==============================
            // USER
            // ==============================

            let user = null;


            try {

                user =
                    JSON.parse(
                        localStorage.getItem("user")
                    );

            } catch (error) {

                user = null;

            }


            if (!user) {

                alert(
                    "Bạn chưa đăng nhập!"
                );


                window.location.href =
                    "login.html";


                return;

            }


            // ==============================
            // CART
            // ==============================

            const cart =
                typeof getCart === "function"
                    ? getCart()
                    : [];


            if (cart.length === 0) {

                alert(
                    "Giỏ hàng đang trống!"
                );

                return;

            }


            // ==============================
            // THÔNG TIN KHÁCH HÀNG
            // ==============================

            const customerName =
                document
                    .getElementById("customerName")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("customerPhone")
                    .value
                    .trim();


            const address =
                document
                    .getElementById("customerAddress")
                    .value
                    .trim();


            const paymentMethod =
                document
                    .getElementById("paymentMethod")
                    .value;


            const message =
                document.getElementById(
                    "checkoutMessage"
                );


            // ==============================
            // KIỂM TRA
            // ==============================

            if (
                !customerName ||
                !phone ||
                !address
            ) {

                if (message) {

                    message.innerHTML = `

                        <div class="alert alert-danger">

                            Vui lòng nhập đầy đủ thông tin!

                        </div>

                    `;

                }

                return;

            }


            // ==============================
            // GỬI SERVER
            // ==============================

            try {

                const response =
                    await fetch(
                        "/api/orders",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                user_id:
                                    user.id,

                                customer_name:
                                    customerName,

                                phone:
                                    phone,

                                address:
                                    address,

                                payment_method:
                                    paymentMethod,

                                items:
                                    cart

                            })

                        }
                    );


                const data =
                    await response.json();


                // ==============================
                // THÀNH CÔNG
                // ==============================

                if (response.ok) {

                    if (message) {

                        message.innerHTML = `

                            <div
                                class="
                                    alert
                                    alert-success
                                "
                            >

                                ${
                                    data.message ||
                                    "Đặt hàng thành công!"
                                }

                                <br>

                                Mã đơn hàng:

                                <strong>
                                    #${data.order_id}
                                </strong>

                            </div>

                        `;

                    }


                    // XÓA GIỎ HÀNG

                    localStorage.removeItem(
                        "cart"
                    );


                    // CẬP NHẬT ICON GIỎ

                    if (
                        typeof updateCartCount ===
                        "function"
                    ) {

                        updateCartCount();

                    }


                    // RESET FORM

                    checkoutForm.reset();

                }


                // ==============================
                // THẤT BẠI
                // ==============================

                else {

                    if (message) {

                        message.innerHTML = `

                            <div
                                class="
                                    alert
                                    alert-danger
                                "
                            >

                                ${
                                    data.message ||
                                    "Không thể đặt hàng!"
                                }

                            </div>

                        `;

                    }

                }


            } catch (error) {

                console.error(
                    "❌ Lỗi đặt hàng:",
                    error
                );


                if (message) {

                    message.innerHTML = `

                        <div
                            class="
                                alert
                                alert-danger
                            "
                        >

                            Không thể kết nối đến server!

                        </div>

                    `;

                }

            }

        }
    );

}