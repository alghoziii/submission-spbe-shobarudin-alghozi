const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCart = async (req, res) => {
    try {
        const customerId = parseInt(req.user.id);

        const cart = await prisma.cart.findFirst({
            where: { customerId },
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

        if (!cart) {
            return res.status(404).json({
                error: 'Cart not found'
            });
        }

        const response = {
            id: cart.id.toString(),
            customer_id: cart.customerId.toString(),
            created_at: cart.createdAt,
            items: cart.items.map(item => ({
                id: item.id.toString(),
                books_product_id: item.productId.toString(),
                quantity: item.quantity,
                created_at: item.createdAt,
                product: {
                    book: {
                        title: item.books_product.book.title
                    },
                    format: item.books_product.format,
                    price: item.books_product.price
                }
            }))
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const customerId = parseInt(req.user.id);
        const { books_product_id, quantity } = req.body;

        const productId = parseInt(books_product_id);
        const qty = parseInt(quantity);

        // Cari atau buat cart customer
        let cart = await prisma.cart.findFirst({
            where: { customerId }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { customerId }
            });
        }

        // Tambahkan item ke cart
        const cartItem = await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: productId,
                quantity: qty
            }
        });

        res.status(201).json({
            id: cartItem.id.toString(),
            cart_id: cartItem.cartId.toString(),
            books_product_id: cartItem.productId.toString(),
            quantity: cartItem.quantity,
            created_at: cartItem.createdAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};