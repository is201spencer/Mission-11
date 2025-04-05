import { useEffect, useState } from "react";
import { book } from "./types/book";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import CategoryFilter from "./CategoryFilter";
import { Link } from "react-router-dom";

const APIUrl = 'https://backend-books-agh6bffjf9e4cng0.eastus-01.azurewebsites.net/api';

function BookList() {
    const [books, setBooks] = useState<book[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [sortField, setSortField] = useState<string>("Title");
    const [sortOrder, setSortOrder] = useState<string>("asc");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [booksPerPage, setBooksPerPage] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [showToast, setShowToast] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, [sortField, sortOrder, currentPage, booksPerPage, selectedCategories]);

    const fetchBooks = async () => {
        setIsLoading(true);
        try {
            const catParams = selectedCategories
                .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
                .join("&");

            const response = await fetch(
                `${APIUrl}/book?sortBy=${sortField}&sortOrder=${sortOrder}&page=${currentPage}&pageSize=${booksPerPage}${selectedCategories.length ? `&${catParams}` : ""}`
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
        } finally {
            setIsLoading(false);
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

    const handleEditBook = (bookId: number) => {
        console.log("Navigating to edit page with bookId:", bookId);
        navigate(`/edit-book/${bookId}`);
    };

    const handleDeleteBook = async (bookId: number) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                const response = await fetch(`${APIUrl}/book/${bookId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error("Failed to delete book");
                }

                alert("Book deleted successfully!");
                fetchBooks(); // Refresh the book list after deletion
            } catch (error) {
                console.error("Error deleting book:", error);
                alert("Failed to delete book");
            }
        }
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

            <CategoryFilter
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
            />

            <div className="d-flex justify-content-center gap-4 mb-3 flex-wrap">
                <div>
                    <label className="me-2">Sort By:</label>
                    <select className="form-select d-inline-block w-auto" value={sortField} onChange={(e) => setSortField(e.target.value)}>
                        <option value="Title">Title</option>
                        <option value="Author">Author</option>
                        <option value="Price">Price</option>
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

            <div>
                <button onClick={() => navigate("/add-book")}>Add Book</button>
            </div>

            <div className="d-flex justify-content-between w-100 mb-4">
                <Link to="/cart" className="btn btn-success">
                    View Cart
                </Link>
            </div>

            <div className="row row-cols-1 row-cols-md-3 g-4">
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    books.map((book) => (
                        <div className="col" key={book.bookId}>
                            <div className="card h-100">
                                <img src="https://via.placeholder.com/150" className="card-img-top" alt={book.title} />
                                <div className="card-body">
                                    <h5 className="card-title">{book.title}</h5>
                                    <p className="card-text">
                                        Author: {book.author}
                                        <br />
                                        Price: ${book.price}
                                    </p>
                                </div>
                                <div className="card-footer text-center">
                                    <button className="btn btn-primary" onClick={() => handleAddToCart(book)}>
                                        Add to Cart
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => handleEditBook(book.bookId)}>
                                        Edit
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteBook(book.bookId)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="pagination mt-4">
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default BookList;
