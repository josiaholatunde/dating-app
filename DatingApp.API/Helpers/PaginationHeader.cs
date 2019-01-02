namespace DatingApp.API.Helpers
{
    public class PaginationHeaders
    {
        public int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalItems { get; set; }
        public PaginationHeaders(int currentPage, int itemsPerPage, int totalPages, int totalItems)
        {
            this.CurrentPage = currentPage;
            this.ItemsPerPage = itemsPerPage;
            this.TotalPages = totalPages;
            this.TotalItems = totalItems;
        }
    }
}