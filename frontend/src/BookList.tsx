import { useEffect, useState } from "react";
import { book } from "./types/book";

function BookList() {
    const [books, setBooks] = useState<book[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [sortField, setSortField] = useState<string>("Title");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [booksPerPage, setBooksPerPage] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        fetchBooks();
    }, [sortField, sortOrder, currentPage, booksPerPage]);

    const fetchBooks = async () => {
        try {
            const response = await fetch(
                `https://localhost:5000/Book?sortBy=${sortField}&sortOrder=${sortOrder}&page=${currentPage}&pageSize=${booksPerPage}`
            );
    
            if (!response.ok) {
                throw new Error("Failed to fetch books");
            }
    
            const data = await response.json();
            console.log("Fetched Data:", data); // 🔍 Debug API response
    
            // ✅ Ensure correct response structure
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

    return (
        <>
            <h1>Book List</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ marginBottom: "12px" }}>
                <label>Sort By: </label>
                <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                    <option value="title">Title</option>
                </select>

                <label style={{ marginLeft: "12px" }}>Order: </label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

            <div style={{ marginBottom: "12px" }}>
                <label>Books per page: </label>
                <select value={booksPerPage} onChange={(e) => setBooksPerPage(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>

            {books.length === 0 ? (
                <p>Loading books...</p>
            ) : (
                books.map((b) => (
                    <div key={b.bookId} id="bookCard" className="card">
                        <h3>{b.title}</h3>
                        <div className="card-body">
                            <ul className="list-unstyled">
                            <li><strong>Author:</strong> {b.author}</li>
                            <li><strong>Publisher:</strong> {b.publisher}</li>
                            <li><strong>ISBN:</strong> {b.isbn}</li>
                            <li><strong>Classification:</strong> {b.classification}</li>
                            <li><strong>Category:</strong> {b.category}</li>
                            <li><strong>Number of Pages:</strong> {b.numPage}</li>
                            <li><strong>Price:</strong> ${b.price.toFixed(2)}</li>
                        </ul>
                        </div>
                    </div>
                ))
            )}

            <div style={{ marginTop: "20px" }}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    Previous
                </button>

                <span style={{ margin: "0 10px" }}>Page {currentPage} of {totalPages}</span>

                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                    Next
                </button>
            </div>
        </>
    );
}

export default BookList;
