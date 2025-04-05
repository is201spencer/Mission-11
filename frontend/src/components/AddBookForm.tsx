import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/forms.css";

function AddBookForm() {
    const navigate = useNavigate();
    const [newBook, setNewBook] = useState({
        title: "",
        author: "",
        publisher: "",
        isbn: "",
        classification: "",
        category: "",
        numPage: 0,
        price: 0,
    });

    const handleInputChange = (e : any) => {
        const { name, value } = e.target;
        setNewBook((prevBook) => ({
            ...prevBook,
            [name]: name === "numPage" || name === "price" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        try {
            const response = await fetch("https://localhost:5001/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBook),
            });

            if (!response.ok) throw new Error("Failed to add book");

            alert("Book added successfully!");
            setNewBook({
                title: "",
                author: "",
                publisher: "",
                isbn: "",
                classification: "",
                category: "",
                numPage: 0,
                price: 0,
            });
            navigate("/");
        } catch (error) {
            console.error("Error adding book:", error);
            alert("Failed to add book");
        }
    };

    return (
        <div className="form-container">
            <div className="form-wrapper">
                <h1>Add New Book</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title" value={newBook.title} onChange={handleInputChange} required />
                    </div>

                    <div className="form-field">
                        <label htmlFor="author">Author</label>
                        <input type="text" name="author" value={newBook.author} onChange={handleInputChange} required />
                    </div>

                    <div className="form-field">
                        <label htmlFor="publisher">Publisher</label>
                        <input type="text" name="publisher" value={newBook.publisher} onChange={handleInputChange} required />
                    </div>

                    <div className="form-field">
                        <label htmlFor="isbn">ISBN</label>
                        <input type="text" name="isbn" value={newBook.isbn} onChange={handleInputChange} required />
                    </div>

                    <div className="form-field">
                        <label htmlFor="classification">Classification</label>
                        <input type="text" name="classification" value={newBook.classification} onChange={handleInputChange} required />
                    </div>

                    <div className="form-field">
                        <label htmlFor="category">Category</label>
                        <input type="text" name="category" value={newBook.category} onChange={handleInputChange} required />
                    </div>

                    <div className="form-field">
                        <label htmlFor="numPage">Number of Pages</label>
                        <input type="number" name="numPage" value={newBook.numPage} onChange={handleInputChange} required />
                    </div>

                    <div className="form-field">
                        <label htmlFor="price">Price</label>
                        <input type="number" name="price" value={newBook.price} onChange={handleInputChange} required />
                    </div>

                    <div className="buttons">
                        <button type="submit">Add Book</button>
                        <button type="button" onClick={() => navigate("/")}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddBookForm;
