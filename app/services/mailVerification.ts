import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import nodemailer from 'nodemailer';
import { promisify } from "util";
import fs from 'fs';

export const mailClientVeficationToken = async (info: any) => {
    const { email, name, token } = info;
    try {
        const defaultDomain = process.env.DOMAIN || 'https://www.google.com/';
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
            subject: "Account Verification",

            html: `<p>Hi ${name}, welcome to EDFD Loans</p><br>
                    <p>Just as a final step to get your account active, kindly click on the provided link below.</p></br>
                    <p>${defaultDomain}${'/api/users/verifyuser/?tk='}${token}</p></br>
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
