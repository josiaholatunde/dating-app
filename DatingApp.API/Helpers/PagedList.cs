using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Helpers
{
    public class PagedList<T> : List<T>
    {
        public int PageSize { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
        public PagedList(List<T> items, int count, int pageSize, int pageNumber)
        {
            TotalCount = count;
            PageSize = pageSize;
            TotalPages = (int) Math.Ceiling(count / (double)pageSize);
            CurrentPage = pageNumber;
            this.AddRange(items);
        }
        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> query, int pageSize, int pageNumber)
        {
            var count = query.Count();
            var items = query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            return new PagedList<T>(items, count, pageSize, pageNumber);
        }

    }
    
}