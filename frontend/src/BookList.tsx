import { useEffect, useState } from "react";
import { book } from "./types/book";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
    const [books, setBooks] = useState<book[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sortField, setSortField] = useState<string>("Title");
    const [sortOrder, setSortOrder] = useState<string>("asc");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [booksPerPage, setBooksPerPage] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [showToast, setShowToast] = useState(false);
    
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, [sortField, sortOrder, currentPage, booksPerPage, selectedCategories]);

    const fetchBooks = async () => {
        try {
            const catParams = selectedCategories
                .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
                .join("&");

            const response = await fetch(
                `https://localhost:5000/Book?sortBy=${sortField}&sortOrder=${sortOrder}&page=${currentPage}&pageSize=${booksPerPage}${selectedCategories.length ? `&${catParams}` : ""}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch books");
            }

            const data = await response.json();

            if (data.books && Array.isArray(data.books)) {
                setBooks(data.books);
                setTotalPages(data.totalPages);
            } else {
                throw new Error("Unexpected API response structure");
            }
        } catch (err) {
            console.error("Error fetching books:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
    };

    const handleAddToCart = (b: book) => {
        addToCart({
            bookId: b.bookId,
            title: b.title,
            price: b.price,
            quantity: 1,
            subtotal: b.price,
        });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="container d-flex flex-column align-items-center mt-4">
            <h1 className="text-center mb-4">Book List</h1>
            {error && <p className="text-danger">{error}</p>}

            {/* Toast Notification */}
            {showToast && (
                <div className="toast show position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1050 }}>
                    <div className="toast-header">
                        <strong className="me-auto">Added to Cart</strong>
                        <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
                    </div>
                    <div className="toast-body">
                        The book has been added to your cart!
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-center gap-4 mb-3 flex-wrap">
                <div>
                    <label className="me-2">Sort By:</label>
                    <select className="form-select d-inline-block w-auto" value={sortField} onChange={(e) => setSortField(e.target.value)}>
                        <option value="title">Title</option>
                    </select>
                </div>
                <div>
                    <label className="me-2">Order:</label>
                    <select className="form-select d-inline-block w-auto" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <div>
                    <label className="me-2">Books per page:</label>
                    <select className="form-select d-inline-block w-auto" value={booksPerPage} onChange={(e) => setBooksPerPage(Number(e.target.value))}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>

            <div className="row justify-content-center">
                {books.length === 0 ? (
                    <p className="text-center">Loading books...</p>
                ) : (
                    books.map((b) => (
                        <div key={b.bookId} className="col-md-6 col-lg-4 mb-4 d-flex justify-content-center">
                            <div className="card h-100 shadow-sm" style={{ width: "18rem" }}>
                                <div className="card-body">
                                    <h5 className="card-title">{b.title}</h5>
                                    <ul className="list-unstyled">
                                        <li><strong>Author:</strong> {b.author}</li>
                                        <li><strong>Price:</strong> ${b.price.toFixed(2)}</li>
                                    </ul>
                                    <button className="btn btn-success w-100" onClick={() => handleAddToCart(b)}>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-primary btn-lg" type="button" onClick={() => navigate('/cart')}>
                    View Cart
                </button>
            </div>

            <div className="d-flex justify-content-center mt-4">
                <button className="btn btn-secondary me-2" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    Previous
                </button>
                <span className="align-self-center">Page {currentPage} of {totalPages}</span>
                <button className="btn btn-secondary ms-2" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                    Next
                </button>
            </div>

            <div className="position-fixed bottom-0 end-0 m-4">
                <button className="btn btn-primary btn-lg rounded-circle shadow-lg" style={{ width: "60px", height: "60px" }} onClick={() => navigate('/cart')}>
                    🛒
                </button>
            </div>
        </div>
    );
}

export default BookList;
