const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());

// Cho phép Node.js chạy website
app.use(express.static(path.join(__dirname, "..")));

// ===============================
// Kiểm tra đường dẫn website
// ===============================

console.log("📁 Thư mục server:", __dirname);
console.log(
    "📄 Đường dẫn register.html:",
    path.join(__dirname, "..", "register.html")
);

// ===============================
// Kết nối MySQL
// ===============================

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "huymobilephone"
});

db.connect((err) => {

    if (err) {
        console.error(
            "❌ Kết nối MySQL thất bại:",
            err.message
        );
        return;
    }

    console.log("✅ Đã kết nối MySQL thành công!");

});

// ===============================
// Trang chủ
// ===============================

app.get("/", (req, res) => {

    res.send(`
        <h1>HuyMobilePhone Backend đang hoạt động!</h1>
        <p>Server Node.js đang chạy.</p>
    `);

});

// Lấy danh sách sản phẩm
app.get("/api/products", (req, res) => {

    const sql = "SELECT * FROM products ORDER BY id DESC";

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Lỗi lấy sản phẩm:", err);

            return res.status(500).json({
                message: "Không thể lấy danh sách sản phẩm!"
            });
        }

        res.json(results);
    });
});

// ===============================
// Trang đăng ký
// ===============================

app.get("/register.html", (req, res) => {

    const filePath = path.join(
        __dirname,
        "..",
        "register.html"
    );

    console.log("📄 Đang mở:", filePath);

    res.sendFile(filePath);

});

// ===============================
// API ĐĂNG KÝ
// ===============================

app.post("/api/register", async (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;

    // Kiểm tra dữ liệu

    if (!name || !email || !password) {

        return res.status(400).json({
            message: "Vui lòng nhập đầy đủ thông tin!"
        });

    }

    try {

        // Kiểm tra email

        const checkSql =
            "SELECT * FROM users WHERE email = ?";

        db.query(
            checkSql,
            [email],
            async (err, results) => {

                if (err) {

                    console.error(
                        "❌ Lỗi kiểm tra email:",
                        err
                    );

                    return res.status(500).json({
                        message: "Lỗi kiểm tra tài khoản!"
                    });

                }

                // Email đã tồn tại

                if (results.length > 0) {

                    return res.status(400).json({
                        message:
                            "Email này đã được đăng ký!"
                    });

                }

                // Mã hóa mật khẩu

                const hashedPassword =
                    await bcrypt.hash(password, 10);

                // Thêm tài khoản

                const sql = `
                    INSERT INTO users
                    (name, email, password)
                    VALUES (?, ?, ?)
                `;

                db.query(
                    sql,
                    [
                        name,
                        email,
                        hashedPassword
                    ],
                    (err, result) => {

                        if (err) {

                            console.error(
                                "❌ Lỗi thêm tài khoản:",
                                err
                            );

                            return res.status(500).json({
                                message:
                                    "Không thể tạo tài khoản!"
                            });

                        }

                        console.log(
                            "✅ Tạo tài khoản:",
                            email
                        );

                        res.json({
                            message:
                                "Đăng ký thành công!"
                        });

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            "❌ Lỗi server:",
            error
        );

        res.status(500).json({
            message: "Lỗi server!"
        });

    }

});

// ===============================
// API ĐĂNG NHẬP
// ===============================

app.post("/api/login", async (req, res) => {

    const { email, password } = req.body;

    // Kiểm tra dữ liệu
    if (!email || !password) {
        return res.status(400).json({
            message: "Vui lòng nhập email và mật khẩu!"
        });
    }

    try {

        // Tìm tài khoản theo email
        const sql = "SELECT * FROM users WHERE email = ?";

        db.query(sql, [email], async (err, results) => {

            if (err) {
                console.error("❌ Lỗi tìm tài khoản:", err);

                return res.status(500).json({
                    message: "Lỗi server!"
                });
            }

            // Không tìm thấy tài khoản
            if (results.length === 0) {
                return res.status(401).json({
                    message: "Email hoặc mật khẩu không đúng!"
                });
            }

            const user = results[0];

            // Kiểm tra mật khẩu
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            // Mật khẩu sai
            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Email hoặc mật khẩu không đúng!"
                });
            }

            // Đăng nhập thành công
            console.log("✅ Đăng nhập:", user.email);

            res.json({
                message: "Đăng nhập thành công!",

                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });

        });

    } catch (error) {

        console.error("❌ Lỗi đăng nhập:", error);

        res.status(500).json({
            message: "Lỗi server!"
        });
    }
});

// ===============================
// KHỞI ĐỘNG SERVER
// ===============================

// ===============================
// API ĐẶT HÀNG
// ===============================

app.post("/api/orders", (req, res) => {

    const {
        user_id,
        customer_name,
        phone,
        address,
        payment_method,
        items
    } = req.body;


    // ===============================
    // KIỂM TRA DỮ LIỆU
    // ===============================

    if (
        !user_id ||
        !customer_name ||
        !phone ||
        !address ||
        !items ||
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return res.status(400).json({
            message: "Vui lòng nhập đầy đủ thông tin đặt hàng!"
        });

    }


    // ===============================
    // TÍNH TỔNG TIỀN
    // ===============================

    let totalAmount = 0;


    for (const item of items) {

        if (
            !item.id ||
            !item.quantity ||
            item.quantity <= 0
        ) {

            return res.status(400).json({
                message: "Thông tin sản phẩm không hợp lệ!"
            });

        }

        totalAmount +=
            Number(item.price) *
            Number(item.quantity);

    }


    // ===============================
    // KIỂM TRA USER
    // ===============================

    const checkUserSql =
        "SELECT id FROM users WHERE id = ?";


    db.query(
        checkUserSql,
        [user_id],
        (userErr, userResults) => {

            if (userErr) {

                console.error(
                    "❌ Lỗi kiểm tra người dùng:",
                    userErr
                );

                return res.status(500).json({
                    message: "Lỗi kiểm tra tài khoản!"
                });

            }


            if (userResults.length === 0) {

                return res.status(401).json({
                    message: "Tài khoản không tồn tại!"
                });

            }


            // ===============================
            // TẠO ĐƠN HÀNG
            // ===============================

            const orderSql = `

                INSERT INTO orders
                (
                    user_id,
                    customer_name,
                    phone,
                    address,
                    payment_method,
                    total_amount,
                    status
                )

                VALUES (?, ?, ?, ?, ?, ?, ?)

            `;


            db.query(
                orderSql,
                [
                    user_id,
                    customer_name,
                    phone,
                    address,
                    payment_method || "COD",
                    totalAmount,
                    "pending"
                ],
                (orderErr, orderResult) => {


                    if (orderErr) {

                        console.error(
                            "❌ Lỗi tạo đơn hàng:",
                            orderErr
                        );

                        return res.status(500).json({
                            message:
                                "Không thể tạo đơn hàng!"
                        });

                    }


                    // ID đơn hàng vừa tạo

                    const orderId =
                        orderResult.insertId;


                    console.log(
                        "✅ Tạo đơn hàng:",
                        orderId
                    );


                    // ===============================
                    // THÊM CHI TIẾT ĐƠN HÀNG
                    // ===============================

                    const itemSql = `

                        INSERT INTO order_items
                        (
                            order_id,
                            product_id,
                            product_name,
                            price,
                            quantity
                        )

                        VALUES (?, ?, ?, ?, ?)

                    `;


                    let completed = 0;


                    items.forEach(item => {


                        const itemValues = [

                            orderId,

                            item.id,

                            item.name,

                            Number(item.price),

                            Number(item.quantity)

                        ];


                        db.query(
                            itemSql,
                            itemValues,
                            (itemErr) => {


                                if (itemErr) {

                                    console.error(
                                        "❌ Lỗi thêm sản phẩm vào đơn:",
                                        itemErr
                                    );

                                    return res.status(500).json({
                                        message:
                                            "Không thể lưu sản phẩm trong đơn hàng!"
                                    });

                                }


                                completed++;


                                // Khi tất cả sản phẩm
                                // đã được lưu

                                if (
                                    completed ===
                                    items.length
                                ) {

                                    console.log(
                                        "✅ Đã lưu chi tiết đơn hàng:",
                                        orderId
                                    );


                                    res.json({

                                        message:
                                            "Đặt hàng thành công!",

                                        order_id:
                                            orderId,

                                        total_amount:
                                            totalAmount

                                    });

                                }

                            }
                        );

                    });

                }
            );

        }
    );

});

// ==================================================
// API LẤY DANH SÁCH ĐƠN HÀNG CỦA USER
// ==================================================

app.get("/api/orders/:user_id", (req, res) => {

    const userId =
        req.params.user_id;


    const sql = `

        SELECT
            id,
            user_id,
            customer_name,
            phone,
            address,
            payment_method,
            total_amount,
            status,
            created_at

        FROM orders

        WHERE user_id = ?

        ORDER BY created_at DESC

    `;


    db.query(
        sql,
        [userId],
        (err, results) => {

            if (err) {

                console.error(
                    "❌ Lỗi lấy danh sách đơn hàng:",
                    err
                );

                return res.status(500).json({

                    message:
                        "Không thể lấy danh sách đơn hàng!"

                });

            }


            res.json({

                orders: results

            });

        }
    );

});


// ==================================================
// API LẤY CHI TIẾT ĐƠN HÀNG
// ==================================================

app.get(
    "/api/orders/detail/:order_id",
    (req, res) => {

        const orderId =
            req.params.order_id;


        // ==============================
        // LẤY THÔNG TIN ĐƠN
        // ==============================

        const orderSql = `

            SELECT
                id,
                user_id,
                customer_name,
                phone,
                address,
                payment_method,
                total_amount,
                status,
                created_at

            FROM orders

            WHERE id = ?

        `;


        db.query(
            orderSql,
            [orderId],
            (orderErr, orderResults) => {


                if (orderErr) {

                    console.error(
                        "❌ Lỗi lấy đơn hàng:",
                        orderErr
                    );

                    return res.status(500).json({

                        message:
                            "Không thể lấy thông tin đơn hàng!"

                    });

                }


                if (
                    orderResults.length === 0
                ) {

                    return res.status(404).json({

                        message:
                            "Không tìm thấy đơn hàng!"

                    });

                }


                const order =
                    orderResults[0];


                // ==============================
                // LẤY SẢN PHẨM TRONG ĐƠN
                // ==============================

                const itemSql = `

                    SELECT
                        id,
                        order_id,
                        product_id,
                        product_name,
                        price,
                        quantity

                    FROM order_items

                    WHERE order_id = ?

                    ORDER BY id ASC

                `;


                db.query(
                    itemSql,
                    [orderId],
                    (itemErr, itemResults) => {


                        if (itemErr) {

                            console.error(
                                "❌ Lỗi lấy sản phẩm trong đơn:",
                                itemErr
                            );

                            return res.status(500).json({

                                message:
                                    "Không thể lấy chi tiết sản phẩm!"

                            });

                        }


                        res.json({

                            order: order,

                            items: itemResults

                        });

                    }
                );

            }
        );

    }
);

// ==================================================
// API LẤY THÔNG TIN TÀI KHOẢN
// ==================================================

app.get("/api/users/:user_id", (req, res) => {

    const userId = req.params.user_id;

    const sql = `
        SELECT
            id,
            name,
            email,
            gender,
            phone,
            birthday,
            address,
            city,
            ward
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {

            console.error(
                "❌ Lỗi lấy thông tin tài khoản:",
                err
            );

            return res.status(500).json({
                message: "Không thể lấy thông tin tài khoản!"
            });
        }

        if (results.length === 0) {

            return res.status(404).json({
                message: "Không tìm thấy tài khoản!"
            });
        }

        res.json({
            user: results[0]
        });

    });

});

// ==================================================
// API CẬP NHẬT THÔNG TIN TÀI KHOẢN
// ==================================================

app.put("/api/users/:user_id", async (req, res) => {

    const userId = req.params.user_id;

    const {
        name,
        gender,
        phone,
        birthday,
        address,
        city,
        ward,
        newPassword
    } = req.body;


    // ==============================================
    // KIỂM TRA TÀI KHOẢN
    // ==============================================

    const checkSql = `
        SELECT id
        FROM users
        WHERE id = ?
    `;

    db.query(
        checkSql,
        [userId],
        async (err, results) => {

            if (err) {

                console.error(
                    "❌ Lỗi kiểm tra tài khoản:",
                    err
                );

                return res.status(500).json({
                    message: "Lỗi server!"
                });
            }


            if (results.length === 0) {

                return res.status(404).json({
                    message: "Không tìm thấy tài khoản!"
                });
            }


            try {

                // ==================================
                // CẬP NHẬT KHÔNG ĐỔI MẬT KHẨU
                // ==================================

                if (!newPassword || newPassword.trim() === "") {

                    const sql = `
                        UPDATE users
                        SET
                            name = ?,
                            gender = ?,
                            phone = ?,
                            birthday = ?,
                            address = ?,
                            city = ?,
                            ward = ?
                        WHERE id = ?
                    `;

                    db.query(
                        sql,
                        [
                            name,
                            gender || null,
                            phone || null,
                            birthday || null,
                            address || null,
                            city || null,
                            ward || null,
                            userId
                        ],
                        (updateErr) => {

                            if (updateErr) {

                                console.error(
                                    "❌ Lỗi cập nhật tài khoản:",
                                    updateErr
                                );

                                return res.status(500).json({
                                    message:
                                        "Không thể cập nhật thông tin!"
                                });
                            }

                            return res.json({
                                message:
                                    "Cập nhật thông tin thành công!"
                            });

                        }
                    );

                    return;
                }


                // ==================================
                // CẬP NHẬT CẢ MẬT KHẨU
                // ==================================

                const hashedPassword =
                    await bcrypt.hash(
                        newPassword,
                        10
                    );


                const sql = `
                    UPDATE users
                    SET
                        name = ?,
                        gender = ?,
                        phone = ?,
                        birthday = ?,
                        address = ?,
                        city = ?,
                        ward = ?,
                        password = ?
                    WHERE id = ?
                `;


                db.query(
                    sql,
                    [
                        name,
                        gender || null,
                        phone || null,
                        birthday || null,
                        address || null,
                        city || null,
                        ward || null,
                        hashedPassword,
                        userId
                    ],
                    (updateErr) => {

                        if (updateErr) {

                            console.error(
                                "❌ Lỗi cập nhật tài khoản:",
                                updateErr
                            );

                            return res.status(500).json({
                                message:
                                    "Không thể cập nhật thông tin!"
                            });
                        }


                        res.json({
                            message:
                                "Cập nhật thông tin và mật khẩu thành công!"
                        });

                    }
                );

            } catch (error) {

                console.error(
                    "❌ Lỗi xử lý mật khẩu:",
                    error
                );

                res.status(500).json({
                    message: "Lỗi server!"
                });

            }

        }
    );

});

app.listen(PORT, () => {

    console.log(
        `🚀 Server chạy tại http://localhost:${PORT}`
    );

});