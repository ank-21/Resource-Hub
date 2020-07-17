var nodemailer = require('nodemailer')

const keys = require('../../config/keys')

//for sending to user
const contactUs = (data) => {
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: keys.helpMail.email,           //email id
      pass: keys.helpMail.pass           //my gmail password
    },
    pool: true
  });
  
  var mailOptions = {
    from: keys.helpMail.email,
    to: `${data.email}`,
    subject:`Resource Hub - ${data.subject}`,
    html:`<table cellspacing="0" cellpadding="0" border="0" style="color:#333;background:#fff;padding:0;margin:0;width:100%;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <tbody><tr width="100%"> <td valign="top" align="left" style="background:#eef0f1;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <table style="border:none;padding:0 18px;margin:50px auto;width:500px"> <tbody> <tr width="100%" height="60"> <td valign="top" align="left" style="border-top-left-radius:4px;border-top-right-radius:4px;background:#27709b url() bottom left repeat-x;padding:10px 18px;text-align:center"><p style="font-size:1.5rem;color:white;padding:7px;;font-weight:bold;">Resource Hub</p> </td></tr> <tr width="100%"> <td valign="top" align="left" style="background:#fff;padding:18px">

    <h1 style="font-size:20px;margin:16px 0;color:#333;text-align:center">Query Received</h1>
   
    <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left">Hello ${data.name}</p><p style="font:1em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left"> Your issue - "${data.message}" has been received and we will resolve this issue soon</p>
    </td>
   
    </tr>
   
    </tbody> </table> </td> </tr></tbody> </table>`
    // html:`<p>Hii ${data.name},<br>"your message" - ${data.message} has been recieved and we will solve this issue soon!!</p>`
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

//for sending to admin
const contactAdmin = (data) => {
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
      to: keys.helpMail.email,
      subject:`Resource Hub User Report`,
      html:`<table cellspacing="0" cellpadding="0" border="0" style="color:#333;background:#fff;padding:0;margin:0;width:100%;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <tbody><tr width="100%"> <td valign="top" align="left" style="background:#eef0f1;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <table style="border:none;padding:0 18px;margin:50px auto;width:500px"> <tbody> <tr width="100%" height="60"> <td valign="top" align="left" style="border-top-left-radius:4px;border-top-right-radius:4px;background:#27709b url() bottom left repeat-x;padding:10px 18px;text-align:center"><p style="font-size:1.5rem;color:white;padding:7px;;font-weight:bold;">Resource Hub</p> </td></tr> <tr width="100%"> <td valign="top" align="left" style="background:#fff;padding:18px">

      <h1 style="font-size:20px;margin:16px 0;color:#333;text-align:center">New Issue</h1>
     
      <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left">A new Report has been issued</p><p style="font:1em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left"> Name - "${data.name}"</p>
      <p style="font:1em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left"> Email - "${data.email}"</p>
      <p style="font:1em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left"> Subject - "${data.subject}" </p>
      <p style="font:1em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left"> Message - "${data.message}"  </p>
      <p style="font:1em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left"> Is Image - "${data.isImg}" </p>
      </td>
      </tr>
      </tbody> </table> </td> </tr></tbody> </table>`
     // html:`A new Report has been issued.<p>Name - ${data.name}</p><p>Email Id - ${data.email}</p><p>Subject - ${data.subject}</p><p>Message - ${data.message}</p><p>Is Image - ${data.isImg}</p>`
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

//for sending to user to correct their credentials
const sendCorrectionMail = (data) => {
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: keys.helpMail.email,           //email id
        pass: keys.helpMail.pass           //my gmail password
      },
      pool: true
    });
    
    var mailOptions = {
      from: keys.helpMail.email,
      to: `${data.email}`,
      subject:`Resource Hub - Inappropriate Credentials`,
      html:`<table cellspacing="0" cellpadding="0" border="0" style="color:#333;background:#fff;padding:0;margin:0;width:100%;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <tbody><tr width="100%"> <td valign="top" align="left" style="background:#eef0f1;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <table style="border:none;padding:0 18px;margin:50px auto;width:500px"> <tbody> <tr width="100%" height="60"> <td valign="top" align="left" style="border-top-left-radius:4px;border-top-right-radius:4px;background:#27709b url() bottom left repeat-x;padding:10px 18px;text-align:center"><p style="font-size:1.5rem;color:white;padding:7px;;font-weight:bold;">Resource Hub</p> </td></tr> <tr width="100%"> <td valign="top" align="left" style="background:#fff;padding:18px">

    <h1 style="font-size:20px;margin:16px 0;color:#333;text-align:center">Inappropriate Information</h1>
   
    <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left">Hello ${data.name}</p><p style="font:1em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left">Your account contains information (some inappropriate words) which are against the rules of Resouce Hub. Kindly, change them within the next 6 hours or else we'll have to remove your account </p>
   
    </td>
   
    </tr>
   
    </tbody> </table> </td> </tr></tbody> </table>`
      // html:`<p>Hii ${data.name},<br>Your account contains information (some inappropriate words) which are against the rules of Resouce Hub. Kindly, change them within the next 6 hours or else we'll have to remove your account </p>`
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
        user: keys.helpMail.email,           //email id
        pass: keys.helpMail.pass           //my gmail password
      },
      pool: true
    });
    
    var mailOptions = {
      from: keys.helpMail.email,
      to: `${data.email}`,
      subject:`Resource Hub - ${data.noteType} Reported Inappropriate`,
      html:`<table cellspacing="0" cellpadding="0" border="0" style="color:#333;background:#fff;padding:0;margin:0;width:100%;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <tbody><tr width="100%"> <td valign="top" align="left" style="background:#eef0f1;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <table style="border:none;padding:0 18px;margin:50px auto;width:500px"> <tbody> <tr width="100%" height="60"> <td valign="top" align="left" style="border-top-left-radius:4px;border-top-right-radius:4px;background:#27709b url() bottom left repeat-x;padding:10px 18px;text-align:center"><p style="font-size:1.5rem;color:white;padding:7px;;font-weight:bold;">Resource Hub</p> </td></tr> <tr width="100%"> <td valign="top" align="left" style="background:#fff;padding:18px">

    <h1 style="font-size:20px;margin:16px 0;color:#333;text-align:center">Inappropriate Notes</h1>
   
    <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left">Hello ${data.name}</p><p style="font:1em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left">Your ${data.noteType} of branch ${data.branch} and semester ${data.semester} has been reported more than 3 times. So you should check it and remove it if it is inappropriate, otherwise we have to remove it and you will also have to face some decrement in your rating.</p> <p style="font:1em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left">If you are having some issue then feel free to contact us through the contact us at <a href="http://18.191.249.98:3000/#contact">http://18.191.249.98:3000/#contact</a> after logging in</p>
   
    </td>
   
    </tr>
   
    </tbody> </table> </td> </tr></tbody> </table>`
      // html:`<p>Hii ${data.name},<br>your ${data.noteType} of branch ${data.branch} and semester ${data.semester} has been reported more than 3 times. So you should check it and remove it if it is inappropriate, otherwise we have to remove it and you will also have to face some decrement in your rating.</p> <p>If you are having some issue then feel free to contact us through the contact us section at <a href="http://18.191.249.98:3000/#contact">http://18.191.249.98:3000/#contact</a> after logging in</p>`
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
          user: keys.helpMail.email,           //email id
          pass: keys.helpMail.pass           //my gmail password
        },
        pool: true
      });
      
      var mailOptions = {
        from: keys.helpMail.email,
        to: `${data.email}`,
        subject:`Resource Hub - Deleted Inappropriate ${data.noteType}`,
        html:`<table cellspacing="0" cellpadding="0" border="0" style="color:#333;background:#fff;padding:0;margin:0;width:100%;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <tbody><tr width="100%"> <td valign="top" align="left" style="background:#eef0f1;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica"> <table style="border:none;padding:0 18px;margin:50px auto;width:500px"> <tbody> <tr width="100%" height="60"> <td valign="top" align="left" style="border-top-left-radius:4px;border-top-right-radius:4px;background:#27709b url() bottom left repeat-x;padding:10px 18px;text-align:center"><p style="font-size:1.5rem;color:white;padding:7px;;font-weight:bold;">Resource Hub</p> </td></tr> <tr width="100%"> <td valign="top" align="left" style="background:#fff;padding:18px">

    <h1 style="font-size:20px;margin:16px 0;color:#333;text-align:center">Deleted Inappropriate Note</h1>
   
    <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left">Hello ${data.name}</p><p style="font:1em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left">Your ${data.noteType} of branch ${data.branch} and semester ${data.semester} has been reported more than 5 times.So it has been deleted automatically, and you also have some decrement in your rating. <p style="font:1em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:left"> We have warned you earlier too but still if you are having some issue then feel free to contact us through the contact us section at <a href="http://18.191.249.98:3000/#contact">http://18.191.249.98:3000/#contact</a> after logging in.</p>
   
    </td>
   
    </tr>
   
    </tbody> </table> </td> </tr></tbody> </table>`
        // html:`<p>Hii ${data.name},<br>your ${data.noteType} of branch ${data.branch} and semester ${data.semester} has been reported more than 5 times. So it is deleted automatically, and you also have some decrement in your rating.<br>We have warned you earlier too but still if you are having some issue then feel free to contact us through the contact us section at <a href="http://18.191.249.98:3000/#contact">http://18.191.249.98:3000/#contact</a> after logging in.</p>`
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
    DeleteMail,
    contactAdmin,
    sendCorrectionMail
}