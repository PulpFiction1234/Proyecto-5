const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const { v4: uuidv4 } = require('uuid'); // Importar la función uuidv4 para generar IDs únicos

const environment = new paypal.core.SandboxEnvironment(
    'ASfmfanLPf2NnJzI1Dvu6Jga06qNF3gWfNUplgbx3n5QDujKhlHUQ7Ln2bLFR7yHgc7dPP4Bn7MR_1jI',
    'ECIcTed2aJ8pe-RRzoZCVBugygn3fVaqxAYH6zRLuiJKpZ7npJC-Jm2UGkOze1KaVFkZlRlxmj5zfoo9'
);
const client = new paypal.core.PayPalHttpClient(environment);

router.post('/', async (req, res) => {
    const { amount } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: amount
            }
        }]
    });

    try {
        const response = await client.execute(request);
        const orderId = uuidv4(); // Generar un ID de orden único
        res.json({ orderId });
    } catch (error) {
        console.error('Error al crear la orden de PayPal:', error);
        res.status(500).json({ error: 'Error al crear la orden de PayPal' });
    }
});

module.exports = router;
