const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token ' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.customer.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};