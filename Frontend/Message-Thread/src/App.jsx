import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import MessageList from './pages/MessageList'
import Header from './components/Header'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<MessageList />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
