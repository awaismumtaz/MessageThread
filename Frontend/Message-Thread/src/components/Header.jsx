import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>Message Thread</h1>
        </Link>
        <nav className="nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header 