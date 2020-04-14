var nodemailer = require('nodemailer')

const keys = require('../../config/keys')

const confirmUser = (data) => {
    console.log(data);
    
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: keys.mail.email,           //email id
      pass: keys.mail.pass           //my gmail password
    },
    pool: true
  });
  const url = `http://18.191.249.98:3000/users/signup/${data.token}?data=${data.id}`;
  var mailOptions = {
    from: keys.mail.email,
    to: `${data.email}`,
    subject:`Resource Hub - Verify Email`,
    html:`<p>Hii ${data.name},<br>Verify your account here by clicking on this link <a href="${url}">${url}</a></p>`
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
    confirmUser
}