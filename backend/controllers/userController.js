import UserModel from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import { sendEmail } from '../config/emailConfig.js';
import { welcomeEmailTemplate } from '../utils/emailTemplates.js';
import { response } from 'express';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';

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
                    url: VerifyEmailUrl,
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
        console.log('gkn');
        const { code } = req.body;

        console.log('bisa');

        // Tunggu sampai MongoDB selesai mencari user dengan _id = code
        // Setelah selesai, hasilnya disimpan ke variabel user
        const user = await UserModel.findOne({ _id: code })

        if (!user) {
            return res.status(400).json({
                message: "Invalid code",
                error: true,
                success: false
            })
        }

        const updatedUser = await UserModel.updateOne({ _id: code }, {
            verify_email: true
        })

        return res.json({
            message: "Verify email done",
            success: true,
            error: false
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function loginController(req, res) {
    // console.log(req.body);
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not register",
                error: true,
                success: false
            })
        }
        // console.log('ada');
        if (user.status !== "Active") {
            return res.status(400).json({
                message: "Contact to Admin",
                error: true,
                success: false
            });
        }

        const checkPassword = await bcryptjs.compare(password, user.password);
        if (!checkPassword) {
            return res.status(400).json({
                message: "Check your password",
                error: true,
                success: false
            })
        }

        // console.log('ada');

        const accesstoken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        // Opsi konfigurasi untuk cookie yang akan dikirim ke browser
        const cookiesOption = {
            // Cookie hanya bisa diakses oleh server, tidak bisa dibaca lewat JavaScript di browser (lebih aman)
            httpOnly: true,

            // Cookie hanya akan dikirim melalui HTTPS (aman di jaringan publik)
            secure: true,

            // Mengizinkan cookie dikirim dalam request cross-site, misalnya ketika frontend dan backend beda domain
            sameSite: "None"
        }
        console.log('ada');
        // Mengirim cookie berisi access token ke browser dengan opsi keamanan di atas
        res.cookie('accessToken', accesstoken, cookiesOption)

        // Mengirim cookie berisi refresh token ke browser dengan opsi keamanan yang sama
        res.cookie('refreshToken', accesstoken, cookiesOption)


        return res.json({
            message: "Login successfully",
            error: false,
            success: true,
            data: {
                accesstoken
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}