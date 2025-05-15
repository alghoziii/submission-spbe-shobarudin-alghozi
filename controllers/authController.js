const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Validasi email format
const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;

        // Validasi input
        if (!name || !email || !password || !address || !phone) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const customer = await prisma.customer.create({
            data: {
                name,
                email,
                password: hashedPassword,
                address,
                phone
            },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                phone: true,
                createdAt: true
            }
        });

        const token = jwt.sign(
            {
                id: customer.id,
                email: customer.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
            }
        );

        res.status(201).json({
            token,

        });

    } catch (error) {
        console.error('Registration error:', error);

        if (error.code === 'P2002') {
            return res.status(409).json({

                error: 'Email already registered'
            });
        }

        res.status(500).json({

            error: 'Registration failed',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validasi input
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        const customer = await prisma.customer.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true
            }
        });

        if (!customer) {
            return res.status(401).json({
                error: 'Email is incorrect'
            });
        }

        const validPassword = await bcrypt.compare(password, customer.password);
        if (!validPassword) {
            return res.status(401).json({
                error: 'password is incorrect'
            });
        }

        const token = jwt.sign(
            {
                id: customer.id,
                email: customer.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
            }
        );

        res.json({
            token,
        });

    } catch (error) {
        console.error('Login error:', error);

        res.status(500).json({
            error: 'Login failed',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};