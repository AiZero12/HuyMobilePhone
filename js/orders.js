/* ==================================================
   HuyMobilePhone
   ORDERS.JS
   Quản lý và hiển thị đơn hàng
================================================== */

console.log("✅ ORDERS.JS ĐÃ ĐƯỢC LOAD");


// ==================================================
// 1. LẤY CÁC PHẦN TỬ HTML
// ==================================================

const ordersList = document.getElementById("ordersList");
const message = document.getElementById("message");


// ==================================================
// 2. LẤY USER ĐANG ĐĂNG NHẬP
// ==================================================

const userData = localStorage.getItem("user");


// ==================================================
// 3. KIỂM TRA ĐĂNG NHẬP
// ==================================================

if (!userData) {

    if (message) {

        message.innerHTML = `
            <div class="alert alert-warning">

                <i class="bi bi-exclamation-circle"></i>

                Bạn cần đăng nhập để xem đơn hàng.

                <a
                    href="login.html"
                    class="alert-link"
                >
                    Đăng nhập ngay
                </a>

            </div>
        `;

    }

    if (ordersList) {
        ordersList.innerHTML = "";
    }

} else {

    try {

        const user = JSON.parse(userData);

        console.log("👤 User hiện tại:", user);

        if (!user.id) {

            throw new Error("Không tìm thấy user.id");

        }

        loadOrders(user.id);

    } catch (error) {

        console.error(
            "❌ Không đọc được thông tin user:",
            error
        );

        localStorage.removeItem("user");

        if (message) {

            message.innerHTML = `
                <div class="alert alert-danger">

                    Thông tin tài khoản không hợp lệ.

                    <a
                        href="login.html"
                        class="alert-link"
                    >
                        Đăng nhập lại
                    </a>

                </div>
            `;

        }

    }

}


// ==================================================
// 4. LẤY DANH SÁCH ĐƠN HÀNG
// ==================================================

async function loadOrders(userId) {

    if (!userId) {

        console.error("❌ Không có user_id");

        return;

    }


    try {

        console.log(
            "🔍 Đang lấy đơn hàng của user:",
            userId
        );


        const response = await fetch(
            `/api/orders/${userId}`
        );


        const data = await response.json();


        console.log(
            "📦 Dữ liệu đơn hàng:",
            data
        );


        // API lỗi

        if (!response.ok) {

            if (message) {

                message.innerHTML = `
                    <div class="alert alert-danger">

                        ${
                            data.message ||
                            "Không thể lấy danh sách đơn hàng!"
                        }

                    </div>
                `;

            }

            return;

        }


        // Không có đơn hàng

        if (
            !data.orders ||
            data.orders.length === 0
        ) {

            displayEmptyOrders();

            return;

        }


        // Xóa thông báo

        if (message) {

            message.innerHTML = "";

        }


        // Hiển thị đơn hàng

        displayOrders(data.orders);


    } catch (error) {

        console.error(
            "❌ Lỗi lấy đơn hàng:",
            error
        );


        if (message) {

            message.innerHTML = `
                <div class="alert alert-danger">

                    Không thể kết nối đến server!

                    <br>

                    <small>
                        ${escapeHTML(error.message)}
                    </small>

                </div>
            `;

        }

    }

}


// ==================================================
// 5. HIỂN THỊ KHI KHÔNG CÓ ĐƠN
// ==================================================

function displayEmptyOrders() {

    if (!ordersList) {

        return;

    }


    ordersList.innerHTML = `

        <div
            class="
                text-center
                py-5
                border
                rounded
                bg-light
            "
        >

            <i
                class="
                    bi
                    bi-receipt
                    display-4
                    text-secondary
                "
            ></i>

            <h5 class="mt-3">

                Bạn chưa có đơn hàng nào.

            </h5>

            <p class="text-secondary">

                Hãy quay lại cửa hàng để mua sản phẩm.

            </p>

            <a
                href="index.html"
                class="btn btn-primary mt-2"
            >

                <i class="bi bi-phone"></i>

                Mua sắm ngay

            </a>

        </div>

    `;

}


// ==================================================
// 6. HIỂN THỊ DANH SÁCH ĐƠN HÀNG
// ==================================================

function displayOrders(orders) {

    if (!ordersList) {

        console.error(
            "❌ Không tìm thấy #ordersList"
        );

        return;

    }


    ordersList.innerHTML = "";


    orders.forEach(order => {

        const statusText =
            getStatusText(order.status);


        const statusClass =
            getStatusClass(order.status);


        const orderHTML = `

            <div
                class="
                    card
                    shadow-sm
                    mb-4
                "
            >

                <div class="card-body">


                    <!-- HEADER -->

                    <div
                        class="
                            d-flex
                            justify-content-between
                            align-items-center
                            flex-wrap
                            gap-2
                            mb-3
                        "
                    >

                        <div>

                            <h5 class="mb-1">

                                Đơn hàng #${order.id}

                            </h5>

                            <small class="text-secondary">

                                ${formatDate(order.created_at)}

                            </small>

                        </div>


                        <span
                            class="
                                badge
                                ${statusClass}
                                p-2
                            "
                        >

                            ${statusText}

                        </span>

                    </div>


                    <hr>


                    <!-- THÔNG TIN KHÁCH HÀNG -->

                    <div class="row g-3">


                        <div class="col-md-6">

                            <strong>
                                Người nhận:
                            </strong>

                            <div>

                                ${escapeHTML(
                                    order.customer_name
                                )}

                            </div>

                        </div>


                        <div class="col-md-6">

                            <strong>
                                Số điện thoại:
                            </strong>

                            <div>

                                ${escapeHTML(
                                    order.phone
                                )}

                            </div>

                        </div>


                        <div class="col-md-6">

                            <strong>
                                Địa chỉ:
                            </strong>

                            <div>

                                ${escapeHTML(
                                    order.address
                                )}

                            </div>

                        </div>


                        <div class="col-md-6">

                            <strong>
                                Thanh toán:
                            </strong>

                            <div>

                                ${escapeHTML(
                                    order.payment_method
                                )}

                            </div>

                        </div>


                    </div>


                    <hr>


                    <!-- TỔNG TIỀN -->

                    <div
                        class="
                            d-flex
                            justify-content-between
                            align-items-center
                        "
                    >

                        <strong>

                            Tổng tiền:

                        </strong>


                        <strong
                            class="
                                text-danger
                                fs-5
                            "
                        >

                            ${formatPrice(
                                order.total_amount
                            )}

                        </strong>

                    </div>


                    <!-- NÚT CHI TIẾT -->

                    <div class="text-end mt-3">

                        <button
                            type="button"
                            class="
                                btn
                                btn-outline-primary
                            "
                            onclick="
                                showOrderDetail(${order.id})
                            "
                        >

                            <i class="bi bi-eye"></i>

                            Xem chi tiết

                        </button>

                    </div>


                </div>

            </div>

        `;


        ordersList.insertAdjacentHTML(
            "beforeend",
            orderHTML
        );

    });

}


// ==================================================
// 7. TRẠNG THÁI ĐƠN HÀNG
// ==================================================

function getStatusText(status) {

    switch (status) {

        case "pending":
            return "Đang chờ xử lý";

        case "confirmed":
            return "Đã xác nhận";

        case "shipping":
            return "Đang giao hàng";

        case "completed":
            return "Đã giao hàng";

        case "cancelled":
            return "Đã hủy";

        default:
            return status || "Không xác định";

    }

}


// ==================================================
// 8. MÀU TRẠNG THÁI
// ==================================================

function getStatusClass(status) {

    switch (status) {

        case "pending":
            return "bg-warning text-dark";

        case "confirmed":
            return "bg-info text-dark";

        case "shipping":
            return "bg-primary";

        case "completed":
            return "bg-success";

        case "cancelled":
            return "bg-danger";

        default:
            return "bg-secondary";

    }

}


// ==================================================
// 9. XEM CHI TIẾT ĐƠN HÀNG
// ==================================================

async function showOrderDetail(orderId) {

    const detail =
        document.getElementById("orderDetail");


    const modalElement =
        document.getElementById("orderDetailModal");


    if (!detail || !modalElement) {

        console.error(
            "❌ Không tìm thấy phần chi tiết đơn hàng!"
        );

        return;

    }


    // Hiển thị loading

    detail.innerHTML = `

        <div class="text-center py-4">

            <div
                class="
                    spinner-border
                    text-primary
                "
            ></div>

            <p class="mt-3">

                Đang tải chi tiết đơn hàng...

            </p>

        </div>

    `;


    // Mở modal

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();


    try {

        console.log(
            "🔍 Đang lấy chi tiết đơn hàng:",
            orderId
        );


        const response =
            await fetch(
                `/api/orders/detail/${orderId}`
            );


        const data =
            await response.json();


        console.log(
            "📦 Chi tiết đơn hàng:",
            data
        );


        if (!response.ok) {

            detail.innerHTML = `

                <div class="alert alert-danger">

                    ${
                        data.message ||
                        "Không thể lấy chi tiết đơn hàng!"
                    }

                </div>

            `;

            return;

        }


        displayOrderDetail(
            data.order,
            data.items
        );


    } catch (error) {

        console.error(
            "❌ Lỗi chi tiết đơn hàng:",
            error
        );


        detail.innerHTML = `

            <div class="alert alert-danger">

                Không thể kết nối đến server!

            </div>

        `;

    }

}


// ==================================================
// 10. HIỂN THỊ CHI TIẾT ĐƠN
// ==================================================

function displayOrderDetail(order, items) {

    const detail =
        document.getElementById("orderDetail");


    if (!detail) {

        return;

    }


    let productsHTML = "";


    // Có sản phẩm

    if (
        items &&
        items.length > 0
    ) {

        items.forEach(item => {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            productsHTML += `

                <div
                    class="
                        d-flex
                        justify-content-between
                        align-items-center
                        border-bottom
                        py-3
                    "
                >

                    <div>

                        <strong>

                            ${escapeHTML(
                                item.product_name
                            )}

                        </strong>

                        <div
                            class="text-secondary"
                        >

                            Số lượng:

                            ${item.quantity}

                        </div>

                    </div>


                    <div class="text-end">

                        <div>

                            ${formatPrice(
                                item.price
                            )}

                        </div>

                        <strong>

                            ${formatPrice(
                                itemTotal
                            )}

                        </strong>

                    </div>

                </div>

            `;

        });

    } else {

        productsHTML = `

            <div class="alert alert-warning">

                Không có sản phẩm trong đơn hàng.

            </div>

        `;

    }


    detail.innerHTML = `

        <div>


            <!-- THÔNG TIN ĐƠN -->

            <div
                class="
                    d-flex
                    justify-content-between
                    align-items-center
                    flex-wrap
                    gap-2
                "
            >

                <div>

                    <h5>

                        Đơn hàng #${order.id}

                    </h5>

                    <p class="text-secondary mb-0">

                        Ngày đặt:

                        ${formatDate(
                            order.created_at
                        )}

                    </p>

                </div>


                <span
                    class="
                        badge
                        ${getStatusClass(
                            order.status
                        )}
                        p-2
                    "
                >

                    ${getStatusText(
                        order.status
                    )}

                </span>

            </div>


            <hr>


            <!-- NGƯỜI NHẬN -->

            <h6>

                <i class="bi bi-person"></i>

                Thông tin người nhận

            </h6>


            <div class="mb-2">

                <strong>
                    Họ tên:
                </strong>

                ${escapeHTML(
                    order.customer_name
                )}

            </div>


            <div class="mb-2">

                <strong>
                    Số điện thoại:
                </strong>

                ${escapeHTML(
                    order.phone
                )}

            </div>


            <div class="mb-2">

                <strong>
                    Địa chỉ:
                </strong>

                ${escapeHTML(
                    order.address
                )}

            </div>


            <div class="mb-3">

                <strong>
                    Thanh toán:
                </strong>

                ${escapeHTML(
                    order.payment_method
                )}

            </div>


            <hr>


            <!-- SẢN PHẨM -->

            <h6>

                <i class="bi bi-box-seam"></i>

                Sản phẩm

            </h6>


            ${productsHTML}


            <!-- TỔNG -->

            <div
                class="
                    d-flex
                    justify-content-between
                    mt-4
                "
            >

                <strong>

                    Tổng tiền:

                </strong>


                <strong
                    class="
                        text-danger
                        fs-5
                    "
                >

                    ${formatPrice(
                        order.total_amount
                    )}

                </strong>

            </div>


        </div>

    `;

}


// ==================================================
// 11. ĐỊNH DẠNG TIỀN
// ==================================================

function formatPrice(price) {

    const number =
        Number(price);


    if (isNaN(number)) {

        return "0đ";

    }


    return number.toLocaleString(
        "vi-VN"
    ) + "đ";

}


// ==================================================
// 12. ĐỊNH DẠNG NGÀY
// ==================================================

function formatDate(date) {

    const d =
        new Date(date);


    if (isNaN(d.getTime())) {

        return date || "";

    }


    return d.toLocaleString(
        "vi-VN"
    );

}


// ==================================================
// 13. BẢO VỆ HTML
// ==================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}