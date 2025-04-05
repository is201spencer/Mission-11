import { useState } from "react";
import BookList from "../BookList";
import CategoryFilter from "../CategoryFilter";

function BooksPage(){
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    return(

        <>
        <CategoryFilter selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
        <BookList selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
        </>
    )
}

export default BooksPage