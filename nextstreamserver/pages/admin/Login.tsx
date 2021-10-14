import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import styles from "../../styles/Home.module.css";
import Providers from "next-auth/providers";

const Home = () => {
  const router = useRouter();

  const [session, loading] = useSession();

  return (
    <div className={styles.container}>
      <Head>
        <title>Strona administracyjna XXXX</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {!session && (
          <>
            <h1>Nie jestś zalogowany</h1> <br />
            <button
              onClick={() =>
                signIn("credentials", {
                  callbackUrl:
                    "https://server332386.nazwa.pl:3003/protected/EditMovies",
                })
              }
            >
              Sign in
            </button>
          </>
        )}

        {session && (
          <>
            <h1>Zalogowany jako {JSON.stringify(session.user)} </h1> <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        )}
      </main>

      <footer className={styles.footer}>Powered by Pragmatic Reviews</footer>
    </div>
  );
};

export default Home;
