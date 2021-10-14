import { useSession, getSession, signIn } from "next-auth/client";
import EmailStatusPanel from "../../server/Components/EmailStatusPanel";
import AdminMenu from "../../server/Components/AdminMenu";

export default function EmailStatus() {
  const [session, loading] = useSession();

  if (typeof window !== "undefined" && loading) return null;

  if (session) {
    return (
      <>
        <AdminMenu />
        <EmailStatusPanel />
      </>
    );
  }
  return (
    <div>
      <p>Nie masz dostępu do tej strony</p>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
