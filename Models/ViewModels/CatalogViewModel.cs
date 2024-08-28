using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.ViewModels
{
    public class CatalogViewModel
    {
        public IEnumerable<Product> Products { get; set; }
        public IEnumerable<SelectListItem>? Categories { get; set; }
    }
}
