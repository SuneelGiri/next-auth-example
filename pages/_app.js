import '../styles/globals.css'
import { getSession } from 'next-auth/react';
import { SessionProvider } from "next-auth/react";


//wrapping so that seesion is available all around the app.
function MyApp({ Component, pageProps, session }) {

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

MyApp.getInitialProps = async (context) => {

  const session = await getSession(context.ctx); //getting user session, if they are logged in.
  
  return {
    session,
  }
} 

export default MyApp