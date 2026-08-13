/* ==================================================
   HuyMobilePhone
   ACCOUNT.JS
   Quản lý tài khoản
================================================== */

console.log("✅ ACCOUNT.JS ĐÃ ĐƯỢC LOAD");


const form =
    document.getElementById("accountForm");

const message =
    document.getElementById("message");


const userData =
    localStorage.getItem("user");


/* ==================================================
   KIỂM TRA ĐĂNG NHẬP
================================================== */

if (!userData) {

    if (message) {

        message.innerHTML = `
            <div class="alert alert-warning">

                Bạn cần đăng nhập để xem tài khoản.

                <a
                    href="login.html"
                    class="alert-link"
                >
                    Đăng nhập ngay
                </a>

            </div>
        `;

    }

    if (form) {
        form.style.display = "none";
    }

} else {

    try {

        const user =
            JSON.parse(userData);


        if (!user.id) {

            throw new Error(
                "Không tìm thấy user.id"
            );

        }


        loadAccount(user.id);

    } catch (error) {

        console.error(
            "❌ Lỗi đọc tài khoản:",
            error
        );

        localStorage.removeItem("user");

        window.location.href =
            "login.html";

    }

}


/* ==================================================
   LẤY THÔNG TIN TÀI KHOẢN
================================================== */

async function loadAccount(userId) {

    try {

        const response =
            await fetch(
                `/api/users/${userId}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Không thể lấy thông tin tài khoản!"
            );

        }


        const user =
            data.user;

document.getElementById("profileName").textContent =
    user.name || "Tài khoản của bạn";

document.getElementById("profileEmail").textContent =
    user.email || "Quản lý thông tin cá nhân";

        document.getElementById("name").value =
            user.name || "";


        document.getElementById("email").value =
            user.email || "";


        document.getElementById("phone").value =
            user.phone || "";


        document.getElementById("address").value =
            user.address || "";


        document.getElementById("city").value =
            user.city || "";


        document.getElementById("ward").value =
            user.ward || "";


        if (user.birthday) {

            document.getElementById(
                "birthday"
            ).value =
                String(user.birthday).substring(0, 10);

        }


        if (user.gender === "Nam") {

            document.getElementById(
                "genderMale"
            ).checked = true;

        }


        if (user.gender === "Nữ") {

            document.getElementById(
                "genderFemale"
            ).checked = true;

        }


    } catch (error) {

        console.error(
            "❌ Lỗi lấy tài khoản:",
            error
        );


        showMessage(
            error.message,
            "danger"
        );

    }

}


/* ==================================================
   CẬP NHẬT TÀI KHOẢN
================================================== */

if (form) {

    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const user =
                JSON.parse(
                    localStorage.getItem("user")
                );


            if (!user || !user.id) {

                showMessage(
                    "Bạn chưa đăng nhập!",
                    "warning"
                );

                return;

            }


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const genderElement =
                document.querySelector(
                    'input[name="gender"]:checked'
                );


            const gender =
                genderElement
                    ? genderElement.value
                    : "";


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            const birthday =
                document
                    .getElementById("birthday")
                    .value;


            const address =
                document
                    .getElementById("address")
                    .value
                    .trim();


            const city =
                document
                    .getElementById("city")
                    .value
                    .trim();


            const ward =
                document
                    .getElementById("ward")
                    .value
                    .trim();


            const newPassword =
                document
                    .getElementById("newPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            // ======================================
            // KIỂM TRA TÊN
            // ======================================

            if (!name) {

                showMessage(
                    "Vui lòng nhập họ tên!",
                    "warning"
                );

                return;

            }


            // ======================================
            // KIỂM TRA MẬT KHẨU
            // ======================================

            if (newPassword !== confirmPassword) {

                showMessage(
                    "Mật khẩu nhập lại không khớp!",
                    "danger"
                );

                return;

            }


            // ======================================
            // GỬI SERVER
            // ======================================

            try {

                const response =
                    await fetch(
                        `/api/users/${user.id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name,
                                gender,
                                phone,
                                birthday,
                                address,
                                city,
                                ward,
                                newPassword

                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Không thể cập nhật!"
                    );

                }


                // ==================================
                // CẬP NHẬT LOCALSTORAGE
                // ==================================

                user.name = name;


                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );


                // ==================================
                // XÓA PASSWORD
                // ==================================

                document.getElementById(
                    "newPassword"
                ).value = "";


                document.getElementById(
                    "confirmPassword"
                ).value = "";


                showMessage(
                    data.message ||
                    "Cập nhật thành công!",
                    "success"
                );


            } catch (error) {

                console.error(
                    "❌ Lỗi cập nhật tài khoản:",
                    error
                );


                showMessage(
                    error.message,
                    "danger"
                );

            }

        }
    );

}


/* ==================================================
   HIỂN THỊ THÔNG BÁO
================================================== */

function showMessage(
    text,
    type
) {

    if (!message) {
        return;
    }


    message.innerHTML = `

        <div class="alert alert-${type}">

            ${escapeHTML(text)}

        </div>

    `;

}


/* ==================================================
   BẢO VỆ HTML
================================================== */

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