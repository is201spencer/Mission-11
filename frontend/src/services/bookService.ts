const API_URL = "https://localhost:5001/books";

export const fetchBooks = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

export const addBook = async (book: any) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
    });
    return response.json();
};

export const updateBook = async (id : number, book : any) => {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
    });
};

export const deleteBook = async (id : number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
