using Books.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Books.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : Controller
    {
        private readonly BookstoreContext _bookstoreContext;

        public BookController(BookstoreContext bookstoreContext)
        {
            _bookstoreContext = bookstoreContext;
        }

        [HttpGet(Name = "GetBook")]
        public IActionResult Get(
        [FromQuery] string sortBy = "Title",
        [FromQuery] string sortOrder = "asc",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5, 
        [FromQuery] List<string>? bookCategories = null)
        {
            var query = _bookstoreContext.Books.AsQueryable();

            if (bookCategories != null && bookCategories.Any()) 
            {
                query = query.Where(b => bookCategories.Contains(b.Category));
            }

            var allowedSortFields = new[] { "Title", "Author", "Publisher", "ISBN", "Classification", "Category", "numPage", "Price" };

            if (!allowedSortFields.Contains(sortBy))
            {
                return BadRequest($"Invalid sort field: {sortBy}. Allowed fields: {string.Join(", ", allowedSortFields)}");
            }

            var booksQuery = query
                .Select(b => new
                {
                    BookId = b.BookId,
                    Title = b.Title,
                    Author = b.Author,
                    Publisher = b.Publisher,
                    ISBN = b.Isbn,
                    Classification = b.Classification,
                    Category = b.Category,
                    numPage = b.PageCount,
                    Price = b.Price
                });

            booksQuery = sortOrder.ToLower() == "desc"
                ? booksQuery.OrderByDescending(b => EF.Property<object>(b, sortBy))
                : booksQuery.OrderBy(b => EF.Property<object>(b, sortBy));

            int totalBooks = booksQuery.Count();
            var books = booksQuery.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return Ok(new { books, totalPages = (int)Math.Ceiling((double)totalBooks / pageSize) });
        }

        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories ()
        {
            var bookCategories = _bookstoreContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(bookCategories);
        }
    }

}
