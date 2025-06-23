import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <h1>Conéctar</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/perfil">Perfil</Link>
      </nav>
    </header>
  );
}