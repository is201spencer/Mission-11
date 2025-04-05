import { useEffect, useState } from "react";
import './CategoryFilter.css';

const APIUrl = 'https://backend-books-agh6bffjf9e4cng0.eastus-01.azurewebsites.net/api';

function CategoryFilter({
    selectedCategories,
    setSelectedCategories,
}: {
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
}) {
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${APIUrl}/Book/GetBookCategories`);
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };

        fetchCategories();
    }, []);

    const checkboxChange = ({ target }: { target: HTMLInputElement }) => {
        const updatedCategories = selectedCategories.includes(target.value)
            ? selectedCategories.filter(x => x !== target.value)
            : [...selectedCategories, target.value];

        setSelectedCategories(updatedCategories);
    };

    return (
        <div className="category-filter-container">
            <h5>Book Categories</h5>
            <div className="category-list">
                {categories.map((c) => (
                    <div key={c} className="category-item">
                        <input
                            type="checkbox"
                            id={c}
                            value={c}
                            checked={selectedCategories.includes(c)}
                            onChange={checkboxChange}
                            className="category-checkbox"
                        />
                        <label htmlFor={c} className="category-label">{c}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryFilter;
