require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Cường nguyễn 👻" <cuongnguyenhd806@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Kết quả đặt lịch khám bệnh", // Subject line
        html: getbodHTMLEmail(dataSend),
    });
}

let getbodHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online</p>
        <p>Thông tin đặt lịch khám bệnh</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào link bên dưới để
        hoàn tất đặt lịch khám bệnh.</p>
        <div>
        <a href=${dataSend.redirectlink} target="_black">Click here</a>

        </div>
        <div>Xin chào và cám ơn</div>
        `
    } if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You received this email because you booked an online medical appointment</p>
        <p>Information to book a medical appointment</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>

        <p>If the above information is true, please click on the link below to
        Complete your medical appointment.</p>
        <div>
            <a href=${dataSend.redirectlink} target="_black">Click here</a>
        </div>
        <div>Hello and thank you</div>
        `
    }
    return result;
}

let getbodHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online thành công</p>
        <p>Thông tin đơn thuốc hóa đơn được gửi trong file đính kèm</p>
        <div>Xin chào và cám ơn</div>
        `
    } if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You received this email because you booked an online medical appointment</p>
        <p>bla bla</p>
        <div>Hello and thank you</div>
        `
    }
    return result;
}

let sendAttachment = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Cường nguyễn 👻" <cuongnguyenhd806@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getbodHTMLEmailRemedy(dataSend),
        attachments: [{
            filename: `remery-${dataSend.patientId}-${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split("base64,")[1],
            encoding: "base64"
        }]
    });
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    getbodHTMLEmail: getbodHTMLEmail,
    getbodHTMLEmailRemedy: getbodHTMLEmailRemedy,
    sendAttachment: sendAttachment
}