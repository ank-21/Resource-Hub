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
  // const url = `http://localhost:3000/users/signup/${data.token}?data=${data.id}`;
  var mailOptions = {
    from: keys.mail.email,
    to: `${data.email}`,
    subject:`Resource Hub - Verify Email`,
    html:`<table cellspacing="0" cellpadding="0" border="0" style="color:#333;background:#fff;padding:0;margin:0;width:100%;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <tbody><tr width="100%"> <td valign="top" align="left" style="background:#eef0f1;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <table style="border:none;padding:0 18px;margin:50px auto;width:500px"> <tbody> <tr width="100%" height="60"> <td valign="top" align="left" style="border-top-left-radius:4px;border-top-right-radius:4px;background:#27709b url() bottom left repeat-x;padding:10px 18px;text-align:center"> <p style="font-size:1.5rem;color:white;padding:7px;;font-weight:bold;">Resource Hub</p> </td></tr> <tr width="100%"> <td valign="top" align="left" style="background:#fff;padding:18px">

 <h1 style="font-size:20px;margin:16px 0;color:#333;text-align:center">Login Verification</h1>

 <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:center">Hello ${data.name}, click on the link below to verify your account</p>

 <div style="background:#f6f7f8;border-radius:3px"> <br>

 <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica;margin-bottom:0;text-align:center"> <a href="${url}" style="border-radius:3px;background:#3aa54c;color:#fff;display:block;font-weight:700;font-size:16px;line-height:1.25em;margin:24px auto 6px;padding:10px 18px;text-decoration:none;width:180px" target="_blank">Click Here</a> </p>

 <br><br> </div>

 <p style="font:14px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333"> <strong>What's Resource Hub?</strong> It's the easiest way to get notes, question papers, all at one place</p>

 </td>

 </tr>

 </tbody> </table> </td> </tr></tbody> </table>`
    // html:`<p>Hii ${data.name},<br>Verify your account here by clicking on this link <a href="${url}">${url}</a></p>`
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

const sendForgotPasswordMail = (data) => {
    console.log(data);
    
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: keys.mail.email,           //email id
      pass: keys.mail.pass           //my gmail password
    },
    pool: true
  });
  const url = `http://18.191.249.98:3000/users/forgotPassword/${data.token}?data=${data.id}`;
  // const url = `http://localhost:3000/users/forgotPassword/${data.token}?data=${data.id}`;
  var mailOptions = {
    from: keys.mail.email,
    to: `${data.email}`,
    subject:`Resource Hub - Reset Password`,
    html:`<table cellspacing="0" cellpadding="0" border="0" style="color:#333;background:#fff;padding:0;margin:0;width:100%;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <tbody><tr width="100%"> <td valign="top" align="left" style="background:#eef0f1;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <table style="border:none;padding:0 18px;margin:50px auto;width:500px"> <tbody> <tr width="100%" height="60"> <td valign="top" align="left" style="border-top-left-radius:4px;border-top-right-radius:4px;background:#27709b url() bottom left repeat-x;padding:10px 18px;text-align:center"><p style="font-size:1.5rem;color:white;padding:7px;;font-weight:bold;">Resource Hub</p> </td></tr> <tr width="100%"> <td valign="top" align="left" style="background:#fff;padding:18px">

    <h1 style="font-size:20px;margin:16px 0;color:#333;text-align:center">Reset Password</h1>
   
    <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:center">Hello ${data.name}, click on the link below to reset your password</p>
   
    <div style="background:#f6f7f8;border-radius:3px"> <br>
   
    <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica;margin-bottom:0;text-align:center"> <a href="${url}" style="border-radius:3px;background:#3aa54c;color:#fff;display:block;font-weight:700;font-size:16px;line-height:1.25em;margin:24px auto 6px;padding:10px 18px;text-decoration:none;width:180px" target="_blank">Click Here</a> </p>
   
    <br><br> </div>
   
    <p style="font:14px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333"> <strong>What's Resource Hub?</strong> It's the easiest way to get notes, question papers, all at one place</p>
   
    </td>
   
    </tr>
   
    </tbody> </table> </td> </tr></tbody> </table>`
    // html:`<div><h4>Hi, ${data.name}.
    // Click on the given link to reset your password</h4><a href="${url}" style="color:red;">Click Here</a></div>`
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
    confirmUser,
    sendForgotPasswordMail
}