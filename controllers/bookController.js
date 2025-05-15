const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllBooks = async (req, res) => {
    try {
        const books = await prisma.book.findMany({
            select: {
                id: true,
                title: true,
                isbn: true,
                publication_year: true,
                genre: true,
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBookDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const bookId = parseInt(id);

        const book = await prisma.book.findUnique({
            where: { id: bookId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                products: {
                    include: {
                        warehouse: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        // Transformasi response
        const response = {
            id: book.id,
            title: book.title,
            isbn: book.isbn,
            publication_year: book.publication_year,
            genre: book.genre,
            author: {
                id: book.author.id,
                name: book.author.name
            },
            products: book.products.map(product => ({
                id: product.id,
                format: product.format,
                price: product.price,
                stock: product.stock,
                warehouse: {
                    id: product.warehouse.id,
                    name: product.warehouse.name
                }
            }))
        };

        res.json({
            success: true,
            data: response
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get book details',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};