import { useSession, getSession, signIn  } from 'next-auth/client'
import axios from 'axios'
import { ResumeToken } from 'mongodb';
import MovieEditor from '../../server/Components/MovieEditor';
import AdminMenu from '../../server/Components/AdminMenu';

export default function EditMovies() {
    const [ session, loading ] = useSession()
  
    if (typeof window !== 'undefined' && loading) return null
  
    if (session) {
      return <>
       <AdminMenu />
      <MovieEditor />
      </>
    }
    return (
    <div>
     
    <div>
    <p>Nie masz dostępu do tej strony</p>
    <button onClick={() => signIn()}>Sign in</button>
    </div>
    </div>
    )
  }
  
  export async function getServerSideProps(context) {
    const session = await getSession(context)
    return {
      props: { session }
    }
  }