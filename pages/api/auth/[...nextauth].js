import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from '../../../lib/auth';
import db from '../../../db';


//this is for the login
//I am using credential provider, custom email and password with postgresql database. there are many others e.g facebook, google, github..

export default NextAuth({
  session: {
    jwt: true, 
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const users = await db.query("SELECT * FROM users WHERE email = $1", [credentials.email]); //checking the user email validity
        if (users.rows[0].email !== credentials.email) {
          throw new Error('No user found!');
        }

        const isValid = await verifyPassword( //checking the password,
          credentials.password,
          users.rows[0].password
        );

        if (!isValid) {
          throw new Error('Could not log you in!');
        }

        const user = users.rows[0]
        return { user };
      },
    }),
  ],
  secret: process.env.SECRET,  //this is required in .env, any string
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      return session; //after user is logged in it returns the session.
    },

    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
});