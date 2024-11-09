const nodeMailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const functions = require('firebase-functions')

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

const port = 3000

const html =
`
<h1>Early Transfert </h1>
<p>Transaction details : </p>
<div>Check your transaction here please : https://dashboard-33d8e.web.app/trackingWithId?transaction=`;
const sms =
`
Early Transfert
Transaction details : 
Check your transaction here please : https://dashboard-33d8e.web.app/trackingWithId?transaction=`;

const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'earlytransfert@gmail.com',
        pass:'wirq nvws vquj olme'
    }

});

async function sendMail(email, id) {
    
    const info = await transporter.sendMail({
        from: 'earlytransfert <earlytransfert@gmail.com>',
        to: email,
        subject: 'Transaction details',
        html: html + `${id}`,
    })
    // console.log("Message sent : " + info.messageId);
    console.log("email :" + email + "and message : " + id );
     return info.messageId;

}

async function sendSmsViaEmail(phoneNumber, carrierDomain, id) {
    const mailOptions = {
      from: 'earlytransfert@gmail.com',
      to: `${phoneNumber}@${carrierDomain}`, // recipient's carrier domain
      subject: 'EarlyTransfert Transaction', // No subject for SMS
      text: sms + `${id}`,
    };
  
    const info = await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('SMS sent:', info.response);
        return info.response;
      }
    });
  }

app.get('/', (req, res) =>  {
    res.send('Hello word');
});

app.get("/sendEmail/:email/:msg", async (req, res) => {
	const email = req.params.email;
    const msg = req.params.msg;
	let content;

	try {
        content =  sendMail(email, msg);
        sendSmsViaEmail('+14384042421', 'txt.att.net'); 
	} catch (err) {
		return res.sendStatus(404);
	}

	res.json({
		content: email
	});
});

app.listen(port, () => {
    console.log(`Listen on port ${port}`)
});

exports.nodeMailerApi = functions.https.onRequest(app)