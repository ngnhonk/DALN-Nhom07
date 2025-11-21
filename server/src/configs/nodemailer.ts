import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


export const sendEmail = async (to: string, subject: string, text: string, html?: string): Promise<void> => {
    try {
        await transporter.sendMail({
            from: `"Bus Booking" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });
    } catch (error) {
        throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};