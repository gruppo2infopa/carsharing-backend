import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'carsharingemail@gmail.com',
    pass: 'auGsJQrCJxHnG2H',
  },
});

export function sendEmail(to: string, subject: string, text: string) {
  const mailOptions = {
    from: 'carsharing-noreply@gmail.com',
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
