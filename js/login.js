/* =====================================================
   HuyMobilePhone
   LOGIN.JS
===================================================== */


/* =====================================================
   1. KHỞI ĐỘNG
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeLogin();
        initializePasswordToggle();
        initializeRegisterLink();
        initializeForgotPassword();

    }
);


/* =====================================================
   2. ĐĂNG NHẬP
===================================================== */

function initializeLogin() {

    const loginForm =
        document.getElementById("loginForm");


    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            if (message) {
                message.innerHTML = "";
            }


            try {

                const response =
                    await fetch(
                        "/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );


                const data =
                    await response.json();


                // ===============================
                // ĐĂNG NHẬP THÀNH CÔNG
                // ===============================

                if (response.ok) {

                    if (message) {

                        message.innerHTML = `

                            <div class="alert alert-success">

                                ${data.message}

                            </div>

                        `;

                    }


                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user)
                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                "/";

                        },
                        1000
                    );


                }

                // ===============================
                // ĐĂNG NHẬP THẤT BẠI
                // ===============================

                else {

                    if (message) {

                        message.innerHTML = `

                            <div class="alert alert-danger">

                                ${data.message}

                            </div>

                        `;

                    }

                }


            } catch (error) {

                console.error(
                    "Lỗi đăng nhập:",
                    error
                );


                if (message) {

                    message.innerHTML = `

                        <div class="alert alert-danger">

                            Không thể kết nối đến server!

                        </div>

                    `;

                }

            }

        }
    );

}


/* =====================================================
   3. HIỆN / ẨN MẬT KHẨU
===================================================== */

function initializePasswordToggle() {

    const showPassword =
        document.getElementById(
            "showPassword"
        );


    const passwordInput =
        document.getElementById(
            "password"
        );


    const passwordIcon =
        document.getElementById(
            "passwordIcon"
        );


    if (
        !showPassword ||
        !passwordInput ||
        !passwordIcon
    ) {

        return;

    }


    showPassword.addEventListener(
        "click",
        function () {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";


                passwordIcon.classList.remove(
                    "bi-eye"
                );


                passwordIcon.classList.add(
                    "bi-eye-slash"
                );

            }

            else {

                passwordInput.type =
                    "password";


                passwordIcon.classList.remove(
                    "bi-eye-slash"
                );


                passwordIcon.classList.add(
                    "bi-eye"
                );

            }

        }
    );

}


/* =====================================================
   4. ĐI ĐẾN TRANG ĐĂNG KÝ
===================================================== */

function initializeRegisterLink() {

    const registerLink =
        document.getElementById(
            "registerLink"
        );


    if (!registerLink) {
        return;
    }


    registerLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            window.location.href =
                "/register.html";

        }
    );

}


/* =====================================================
   5. QUÊN MẬT KHẨU
===================================================== */

function initializeForgotPassword() {

    const forgotPassword =
        document.getElementById(
            "forgotPassword"
        );


    if (!forgotPassword) {
        return;
    }


    forgotPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            alert(
                "Chức năng quên mật khẩu sẽ được thêm sau."
            );

        }
    );

}