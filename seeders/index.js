const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const warehouse1 = await prisma.warehouse.create({
        data: {
            name: 'Gudang Jakarta',
            location: 'Jakarta Pusat', 
            capacity: 1000 
        }
    });

    const warehouse2 = await prisma.warehouse.create({
        data: {
            name: 'Gudang Bandung',
            location: 'Bandung',
            capacity: 800
        }
    });

    const author1 = await prisma.author.create({
        data: {
            name: 'Robert C. Martin'
        }
    });

    const author2 = await prisma.author.create({
        data: {
            name: 'Eric Evans'
        }
    });

    const book1 = await prisma.book.create({
        data: {
            title: 'Clean Code',
            isbn: '9780132350884',
            publication_year: 2008,
            genre: 'Programming',
            authorId: author1.id
        }
    });

    const book2 = await prisma.book.create({
        data: {
            title: 'Domain-Driven Design',
            isbn: '9780321125217',
            publication_year: 2003,
            genre: 'Software Design',
            authorId: author2.id
        }
    });

    await prisma.booksProduct.create({
        data: {
            format: 'hardcover',
            price: 350000,
            stock: 12,
            bookId: book1.id,
            warehouseId: warehouse1.id
        }
    });

    await prisma.booksProduct.create({
        data: {
            format: 'paperback',
            price: 250000,
            stock: 20,
            bookId: book1.id,
            warehouseId: warehouse2.id
        }
    });

    await prisma.booksProduct.create({
        data: {
            format: 'hardcover',
            price: 400000,
            stock: 8,
            bookId: book2.id,
            warehouseId: warehouse1.id
        }
    });

    console.log('Seeding completed successfully');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });