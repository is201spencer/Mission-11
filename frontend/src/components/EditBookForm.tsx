import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/forms.css";

type Book = {
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
};

const APIUrl = 'https://backend-books-agh6bffjf9e4cng0.eastus-01.azurewebsites.net/api';

const EditBookForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book>({
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    classification: "",
    category: "",
    pageCount: 0,
    price: 0,
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${APIUrl}/Book/${id}`);
        if (!response.ok) throw new Error("Failed to fetch book");

        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: name === "pageCount" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${APIUrl}/Book/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });

      if (!response.ok) throw new Error("Failed to update book");

      alert("Book updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book.");
    }
  };

  // Fix TS7053: Define fields as keys of the Book type
  const textFields: (keyof Pick<Book, "title" | "author" | "publisher" | "isbn" | "classification" | "category">)[] = [
    "title",
    "author",
    "publisher",
    "isbn",
    "classification",
    "category",
  ];

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h1>Edit Book</h1>
        <form onSubmit={handleSubmit}>
          {textFields.map((field) => (
            <div key={field} className="form-field">
              <label htmlFor={field}>{field}</label>
              <input
                type="text"
                name={field}
                value={book[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="form-field">
            <label htmlFor="pageCount">Page Count</label>
            <input
              type="number"
              name="pageCount"
              value={book.pageCount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={book.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="buttons">
            <button type="button" onClick={() => navigate("/")}>
              Cancel
            </button>
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookForm;
