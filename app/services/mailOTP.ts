import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import nodemailer from 'nodemailer';
import { promisify } from "util";
import fs from 'fs';

export const mailOTP = async (info: any) => {
    const { email,otp } = info;
    try {
        const readFileAsync = promisify(fs.readFile);
        const imageAttachment = await readFileAsync('companyimg.jpg');
        const smtpConfig: SMTPTransport.Options = {
            host: process.env.HOST,
            port: Number(465),
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        };
        const transporter = nodemailer.createTransport(smtpConfig);
        transporter.sendMail({
            from: process.env.FROM,
            to: email,
            subject: "Password Reset",
            text: `Your OTP is ${otp}`,

            html: `<p>Hi, You  recently requested a password reset</p><br>
                    <p>Here is your OTP : ${otp}</p></br>
                    <p>Regards,</p></br>
                    <p>LEDA EDFD Team.</p></br>
                    <img style="aspect-ratio: 16 / 9; width:100%; height:150px;" src="cid:uniqueImageCID" alt="Embedded Image">`,
            attachments: [{
                filename: 'companyimg.jpg',
                content: imageAttachment,
                encoding: 'base64',
                cid: 'uniqueImageCID',
            }]
        })
        return "message sent";
    } catch (error: any) {
        console.error('Error sending email:', error);
        return error.message;
    }
}
