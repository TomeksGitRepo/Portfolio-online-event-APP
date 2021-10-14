export default function AdminMenu() {
  return (
    <>
      <div className="ui pointing menu">
        <a href="/" className="item">
          Home
        </a>
        <a href="/protected/EditMovies" className="item">
          Edytuj filmy
        </a>
        <a href="/protected/EditUsers" className="item">
          Edytuj użytkowników
        </a>
        <a href="/protected/EmailStatus" className="item">
          Status wiadomości EMAIL
        </a>
      </div>
      <div className="ui segment">
        <p></p>
      </div>
    </>
  );
}
