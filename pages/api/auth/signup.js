import { hashPassword } from '../../../lib/auth';
import db from '../../../db';
import { sendEmail } from "../../../helpers/sendMail";
var generator = require('generate-password');

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;

  const { registerEmail } = data;

  var registerPassword = generator.generate({
    length: 10,
    numbers: true
  });

  if (
    !registerEmail ||
    !registerEmail.includes('@')
  ) {
    res.status(422).json({
      message:
        'Invalid email',
    });
    return;
  }

  const customer = await stripe.customers.create({
    email: registerEmail,
  });

  const message = `<div>Your password for the website is ${registerPassword}</div></br>
    <div>happy Shopping!</div>`

  sendEmail({ //just simply sending the password to the user email.
    to: registerEmail,
    subject: "Your Password for website",
    text: message,
  })
  
  const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [registerEmail]);

  if (existingUser.rows.length !== 0) { //checking whether user already exist.
    res.status(422).json({ message: 'User exists already!' });
    //client.close();
    return;
  }




  const hashedPassword = await hashPassword(registerPassword); //hashing the password.

  const result = await db.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) returning *",
    [registerEmail, registerEmail, hashedPassword] //signing up the user.
  );

  res.status(201).json({ message: 'Created user!' });

}

export default handler;
