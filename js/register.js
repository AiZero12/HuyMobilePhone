/* =====================================================
   HuyMobilePhone
   REGISTER.JS
===================================================== */


/* =====================================================
   1. KHỞI ĐỘNG
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeRegister();

    }
);


/* =====================================================
   2. ĐĂNG KÝ
===================================================== */

function initializeRegister() {

    const registerForm =
        document.getElementById(
            "registerForm"
        );


    if (!registerForm) {
        return;
    }


    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    .value;


            const message =
                document.getElementById(
                    "message"
                );


            // ===============================
            // KIỂM TRA MẬT KHẨU
            // ===============================

            if (
                password !==
                confirmPassword
            ) {

                if (message) {

                    message.innerHTML = `

                        <span class="text-danger">

                            Mật khẩu nhập lại không giống nhau!

                        </span>

                    `;

                }

                return;

            }


            // ===============================
            // GỬI DỮ LIỆU SERVER
            // ===============================

            try {

                const response =
                    await fetch(
                        "/api/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name: name,

                                email: email,

                                password: password

                            })
                        }
                    );


                const data =
                    await response.json();


                // ===============================
                // ĐĂNG KÝ THÀNH CÔNG
                // ===============================

                if (response.ok) {

                    if (message) {

                        message.innerHTML = `

                            <span class="text-success">

                                ${data.message}

                            </span>

                        `;

                    }


                    registerForm.reset();

                }


                // ===============================
                // ĐĂNG KÝ THẤT BẠI
                // ===============================

                else {

                    if (message) {

                        message.innerHTML = `

                            <span class="text-danger">

                                ${data.message}

                            </span>

                        `;

                    }

                }


            } catch (error) {

                console.error(
                    "Lỗi đăng ký:",
                    error
                );


                if (message) {

                    message.innerHTML = `

                        <span class="text-danger">

                            Không thể kết nối đến server!

                        </span>

                    `;

                }

            }

        }
    );

}