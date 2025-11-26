import UserModel from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import { sendEmail } from '../config/emailConfig.js';
import { welcomeEmailTemplate } from '../utils/emailTemplates.js';

export async function registerUserController(req, res) {
    try {
        const { name, email, password } = req.body;

        // Validation dengan object errors
        const errors = {};

        if (!name) errors.name = "Name is required";
        if (!email) errors.email = "Email is required";
        if (!password) errors.password = "Password is required";

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                errors,
                success: false,
            });
        }

        // Check existing user
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                message: 'Email already registered',
                error: true,
                success: false
            });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create user payload
        const payload = {
            name,
            email,
            password: hashedPassword
        }

        // Save user to database
        const newUser = new UserModel(payload);
        const savedUser = await newUser.save();

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser._id}`

        // **KIRIM EMAIL WELCOME SAJA**
        try {
            await sendEmail({
                sendTo: email,
                subject: 'Selamat Datang di Awan Store - Registrasi Berhasil',
                html: welcomeEmailTemplate({
                    name: savedUser.name,
                    email: savedUser.email,
                    url : VerifyEmailUrl,
                    date: new Date().toLocaleDateString('id-ID')
                })
            });
            console.log('✅ Welcome email sent to:', email);
        } catch (emailError) {
            console.error('❌ Failed to send welcome email:', emailError);
            // Tetap lanjutkan response success meski email gagal
        }

        // Response success
        return res.status(201).json({
            message: 'User registered successfully',
            error: false,
            success: true,
            data: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).send({
            message: error.message || 'Internal server error',
            error: true,
            success: false
        });
    }
}

export async function verifyEmailController(req, res) {
    try {
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}