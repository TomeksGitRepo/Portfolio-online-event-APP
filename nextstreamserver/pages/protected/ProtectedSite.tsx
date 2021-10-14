import { useSession, getSession, signIn  } from 'next-auth/client'

export default function ProtectedSite() {
    const [ session, loading ] = useSession()
  
    if (typeof window !== 'undefined' && loading) return null
  
    if (session) {
      return <>
        <h1>Protected Page</h1>
        <p>You can view this page because you are signed in.</p>
      </>
    }
    return <div>
    <p>Access Denied</p>
    <button onClick={() => signIn()}>Sign in</button>
    </div>
  }
  
  export async function getServerSideProps(context) {
    const session = await getSession(context)
    return {
      props: { session }
    }
  }