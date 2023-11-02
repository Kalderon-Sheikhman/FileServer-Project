import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_MAIL,
      pass: process.env.ADMIN_PASS
    }
  });

  export default transporter