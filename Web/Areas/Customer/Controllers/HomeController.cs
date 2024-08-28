using DataAccess.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Models;
using Models.ViewModels;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Security.Claims;
using Utility;

namespace Web.Areas.Customer.Controllers
{
    [Area("Customer")]
    public class HomeController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger,IUnitOfWork unitOfWork)
        {
            _logger = logger;
            _unitOfWork = unitOfWork;
        }

        public IActionResult Index()
        {
            IEnumerable<Product>? products = _unitOfWork?.Product?.GetAll(includeProperties: "Category").Reverse().Take(10);
            IEnumerable<Banner>? banners = _unitOfWork?.Banners?.GetAll();
            IEnumerable<Product>? productsHistory;
            

            var history = HttpContext.Session.GetString("History");
            if(history != null && history != "") { 
                IEnumerable<Product>? productHistory = JsonConvert.DeserializeObject<List<Product>>(history);

                productsHistory = productHistory;
            }
            else
            {
                productsHistory = new List<Product>();
            }

            HomeViewModel homeViewModel = new HomeViewModel()
            {
                Products = products,
                History = productsHistory,
                Banners = banners
            };

            return View(homeViewModel);
        }

        public IActionResult Catalog(int category = 0, string search = "", string priceRange = "")
        {
            IEnumerable<Product>? products = _unitOfWork?.Product?.GetAll(includeProperties: "Category");
            int viewBagCount = 0;
            var orderedList = products.ToList().OrderBy(p => p.Price100);
            int? minPossiblePrice = Convert.ToInt32(orderedList.FirstOrDefault().Price100);

            orderedList = products.ToList().OrderBy(p => p.ListPrice);
            int? maxPossiblePrice = Convert.ToInt32(orderedList.LastOrDefault().ListPrice);
            if (search != "")
            {
               products = products.Where(p => (
                                         p.Title.ToLower().Contains(search.ToLower()) ||
                                         p.Author.ToLower().Contains(search.ToLower())
                                         ));
                viewBagCount++;
            }


            if(category != 0)
            {
                products = products.Where(p => p.CategoryId == category);
                viewBagCount++;
            }

            if(priceRange != "")
            {
                int minPrice = Convert.ToInt32(priceRange.Split('-')[0]);
                int maxPrice = Convert.ToInt32(priceRange.Split('-')[1]);
                products = products.Where(p => p.ListPrice <= maxPrice && p.Price100 >= minPrice);
                viewBagCount++;
            }



            CatalogViewModel catalog = new CatalogViewModel() {
                Products = products,
                Categories = _unitOfWork?.Category?
                    .GetAll().Select(c => new SelectListItem
                    {
                        Text = c.Name,
                        Value = c.Id.ToString(),
                    })
            };

            ViewBag.Search = search;
            ViewBag.Category = category;
            ViewBag.PriceRange = priceRange;
            ViewBag.ViewBagCount = viewBagCount;
            ViewBag.MaxPrice = maxPossiblePrice;
            ViewBag.MinPrice = minPossiblePrice;
            return View(catalog);
        }


        public IActionResult GetProductsFromArray()
        {
            return Json(new { message = "Hello" });
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [Authorize]
        public IActionResult AddToCartById(int? productId)
        {
            ShoppingCart shoppingCart = new()
            {
                Product = _unitOfWork?.Product?
                .Get(p => p.Id == productId, includeProperties: "Category"),
                Count = 1,
                ProductId = productId,
            };

            DetailsPOST(shoppingCart);
            return RedirectToAction(nameof(Catalog));
        }

        public IActionResult Details(int? productId)
        {

            ShoppingCart shoppingCart = new()
            {
                Product = _unitOfWork?.Product?
            .Get(p => p.Id == productId, includeProperties: "Category"),
                Count = 1,
                ProductId = productId
            };

            var history = HttpContext.Session.GetString("History");
            if (history == null)
            {
                List<Product> products = new List<Product>{ shoppingCart.Product };
                HttpContext.Session.SetString("History",JsonConvert.SerializeObject(products));
            }
            else 
            {
                List<Product>? products = JsonConvert.DeserializeObject<List<Product>>(history);
                if (products.Where(p => p.Id == productId).Count() == 0)
                {
                    products.Insert(0,shoppingCart.Product);
                    products = products?.Take(10).ToList();
                    HttpContext.Session.SetString("History",JsonConvert.SerializeObject(products));
                }
            }


            return View(shoppingCart);

        }

        [HttpPost]
        [Authorize]
        [ActionName("Details")]
        public IActionResult DetailsPOST(ShoppingCart shoppingCart)
        {
            var claimsIndentity = (ClaimsIdentity?)User.Identity;
            var userId = claimsIndentity?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            shoppingCart.ApplicationUserId = userId;


            ShoppingCart? cartFromDb = _unitOfWork?.ShoppingCart?
                    .Get(u => u.ApplicationUserId == userId &&
                        u.ProductId == shoppingCart.ProductId);


            if (cartFromDb != null)
            {
                // shopping cart exists
                cartFromDb.Count += shoppingCart.Count;
                _unitOfWork?.ShoppingCart?.Update(cartFromDb);
                _unitOfWork?.Save();
            }
            else
            {
                // add cart record
                _unitOfWork?.ShoppingCart?.Add(shoppingCart);
                _unitOfWork?.Save();
                HttpContext.Session.SetInt32(SD.SessionCart, (int)_unitOfWork?.ShoppingCart?
                                   .GetAll(u => u.ApplicationUserId == userId).Count());
            }
            TempData["Success"] = "Cart Updated Successfully";
            return RedirectToAction(nameof(Index));
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
