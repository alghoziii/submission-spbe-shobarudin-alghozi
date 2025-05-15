const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.checkout = async (req, res) => {
    try {
        const customerId = parseInt(req.user.id);

        const cart = await prisma.cart.findFirst({
            where: {
                customerId
            },
            include: {
                items: {
                    include: {
                        books_product: {
                            include: {
                                book: {
                                    select: {
                                        title: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        if (cart.items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

        // Hitung total amount
        const totalAmount = cart.items.reduce((total, item) => {
            return total + (item.books_product.price * item.quantity);
        }, 0);

        const [invoice] = await prisma.$transaction([
            prisma.invoice.create({
                data: {
                    cartId: cart.id,
                    customerId,
                    totalAmount,
                    status: 'pending',
                    items: {
                        create: cart.items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.books_product.price
                        }))
                    }
                }
            }),

            prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            })
        ]);

        res.status(201).json({
            invoice_id: invoice.id.toString(),
            status: invoice.status,
            total_amount: invoice.totalAmount,
            issued_at: invoice.issuedAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getInvoices = async (req, res) => {
    try {
        const customerId = req.user.id;

        const invoices = await prisma.invoice.findMany({
            where: { customerId }
        });

        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};