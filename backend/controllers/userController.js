import UserModel from '../models/userModel.js';
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import sendEmail from '../config/sendEmail.js';

export async function registerUserController(req, res) {
    try {
        const { name, email, password } = req.body;

        // validation
        // if (!name) {
        //     return res.status(400).send({
        //         message: 'Name is required',
        //         error: true,
        //         success: false
        //     });
        // }
        // if (!email) {
        //     return res.status(400).send({
        //         message: 'Email is required',
        //         error: true,
        //         success: false
        //     });
        // }
        // if (!password) {
        //     return res.status(400).send({
        //         message: 'Password is required',
        //         error: true,
        //         success: false
        //     });
        // }

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

        // check user
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                message: 'Already registered email',
                error: true,
                success: false
            });
        }

        // bcrypt password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const payload = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new UserModel(payload);
        const save = await newUser.save();

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

        const verifEmail = await sendEmail({
            sendTo: email,
            subject: 'Verify email from Awan Store',
            html: verifyEmailTemplate({name, url:VerifyEmailUrl})
        })

        return res.json({
            message: 'User register successfully',
            error: false,
            success: true,
            data :  save
        })

    } catch (error) {

        return res.status(500).send({
            message : error.message ||  error,
            error: true,
            success: false
        })

    }
}