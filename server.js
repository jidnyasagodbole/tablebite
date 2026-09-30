const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let orders = [];

app.get("/", (req, res) => {
    res.json({
        message: "TABLEBITE backend is running!"
    });
});

app.get("/api/orders", (req, res) => {
    res.json(orders);
});

app.post("/api/orders", (req, res) => {

    const order = {
        id: "BB" + (orders.length + 101),
        table: req.body.table,
        items: req.body.items,
        total: req.body.total,
        status: "NEW",
        createdAt: new Date()
    };

    orders.push(order);

    res.json({
        success: true,
        order: order
    });
});

app.patch("/api/orders/:id", (req, res) => {

    const order = orders.find(
        order => order.id === req.params.id
    );

    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }

    order.status = req.body.status;

    res.json({
        success: true,
        order: order
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`TABLEBITE backend running on port ${PORT}`);
});
