import BooksPage from './pages/BookPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';
import AddBookForm from "./components/AddBookForm";
import EditBookForm from "./components/EditBookForm";
import "./style/site.css";

function App() {
  return (
    <>
    <CartProvider>
    <Router>
      <Routes>
        <Route path='/' element={<BooksPage />} />
        <Route path="/add-book" element={<AddBookForm />} />
        <Route path="/edit-book/:id" element={<EditBookForm />} />
        <Route path='/cart' element={<CartPage />} />
      </Routes>
    </Router>
    </CartProvider>
    </>
  )
}

export default App
