import { useSession, getSession, signIn  } from 'next-auth/client'
import UserEditor from '../../server/Components/UserEditor'
import AdminMenu from '../../server/Components/AdminMenu'



export default function EditUsers() {
    const [ session, loading ] = useSession()
  
    if (typeof window !== 'undefined' && loading) return null
  
    if (session) {
      return <>
      <AdminMenu />
      <UserEditor />
      </>
    }
    return <div>
    <p>Nie masz dostępu do tej strony</p>
    <button onClick={() => signIn()}>Sign in</button>
    </div>
  }
  
  export async function getServerSideProps(context) {
    const session = await getSession(context)
    return {
      props: { session }
    }
  }