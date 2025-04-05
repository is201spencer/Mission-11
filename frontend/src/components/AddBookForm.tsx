import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../style/forms.css";

const APIUrl = 'https://backend-books-agh6bffjf9e4cng0.eastus-01.azurewebsites.net/api';

type NewBook = {
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  numPage: number;
  price: number;
};

function AddBookForm() {
  const navigate = useNavigate();
  const [newBook, setNewBook] = useState<NewBook>({
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    classification: "",
    category: "",
    numPage: 0,
    price: 0,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBook((prevBook) => ({
      ...prevBook,
      [name]: name === "numPage" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${APIUrl}/book`, {
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
          {["title", "author", "publisher", "isbn", "classification", "category"].map((field) => (
            <div className="form-field" key={field}>
              <label htmlFor={field}>{field}</label>
              <input
                type="text"
                name={field}
                value={newBook[field as keyof NewBook] as string}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}

          <div className="form-field">
            <label htmlFor="numPage">Number of Pages</label>
            <input
              type="number"
              name="numPage"
              value={newBook.numPage}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              value={newBook.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="buttons">
            <button type="submit">Add Book</button>
            <button type="button" onClick={() => navigate("/")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBookForm;
