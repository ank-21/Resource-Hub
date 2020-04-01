var nodemailer = require('nodemailer')

const keys = require('../../config/keys')

const contactUs = ({data}) => {
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: keys.mail.email,           //email id
      pass: keys.mail.pass           //my gmail password
    },
    pool: true
  });
  
  var mailOptions = {
    from: keys.mail.email,
    to: `${data.email}`,
    subject:`Resource Hub - ${data.subject}`,
    html:`<p>Hii ${data.name},<br>your message - ${data.message} has been recieved and we will solve this issue soon!!</p>`
  };
  console.log("mailOptions : " ,mailOptions);
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}




module.exports = {
    contactUs
}