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


const reportsMail = (data) => {
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
      subject:`Resource Hub - ${data.noteType} Reported Inappropriate`,
      html:`<p>Hii ${data.name},<br>your ${data.noteType} of branch ${data.branch} and semester ${data.semester} has been reported more than 3 times. So you should check it and remove it if it is inappropriate, otherwise we have to remove it and you will also have to face some decrement in your rating.</p> <p>If you are having some issue then feel free to contact us through the contact us section at <a href="http://18.191.249.98:3000/#contact">http://18.191.249.98:3000/#contact</a> after logging in</p>`
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

  const DeleteMail = (data) => {
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
        subject:`Resource Hub - Deleted Inappropriate ${data.noteType}`,
        html:`<p>Hii ${data.name},<br>your ${data.noteType} of branch ${data.branch} and semester ${data.semester} has been reported more than 5 times. So it is deleted automatically, and you also have some decrement in your rating.<br>We have warned you earlier too but still if you are having some issue then feel free to contact us through the contact us section at <a href="http://18.191.249.98:3000/#contact">http://18.191.249.98:3000/#contact</a> after logging in.</p>`
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
    contactUs,
    reportsMail,
    DeleteMail
}