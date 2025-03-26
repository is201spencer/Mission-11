import { useEffect, useState } from "react";

function CategoryFilter({selectedCategories, setSelectedCategories: setSelectedCategories}: 
    {selectedCategories: string[]; 
        setSelectedCategories: (categories: string[]) => void
    })
{
    const [categories, setCategories] = useState<string[]>([]);
    // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    useEffect(() => {
        const fetchCategories = async() => {
            try{
            const response = await fetch('https://localhost:5000/Book/GetBookCategories');
            const data = await response.json();

            setCategories(data);
            }
            catch (error){
                console.error('Error fetching categories', error)
            }
        }

        fetchCategories();
    }, [])

    function checkboxChange({target}: {target:HTMLInputElement})
    {
        const updatedCategories = selectedCategories.includes(target.value) ? selectedCategories.filter(x => x !== target.value)
        : [...selectedCategories, target.value];

        setSelectedCategories(updatedCategories);
    }
    return(
        <div>
            <h5>Book Categories</h5>
            <div>
                {categories.map((c) =>(
                    <div key={c}>
                        <input type="checkbox" 
                        id={c} 
                        value={c} 
                        checked={selectedCategories.includes(c)} 
                        onChange={checkboxChange}/>
                        <label htmlFor={c}>{c}</label>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default CategoryFilter;