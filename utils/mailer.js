const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendReminderEmail = (email, task) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Task Due Reminder',
        text: `Your task "${task.title}" is due on ${task.dueDate}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = sendReminderEmail;