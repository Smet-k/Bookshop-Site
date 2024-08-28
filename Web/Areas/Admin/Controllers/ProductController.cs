using DataAccess.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Models;
using Models.ViewModels;
using Utility;

[Area("Admin")]
[Authorize(Roles = SD.Role_Admin)]
public class ProductController : Controller
{


    private readonly IUnitOfWork _unitOfWork;
    private readonly IWebHostEnvironment _webHostEnvironment;
    public ProductController(IUnitOfWork unitOfWork, IWebHostEnvironment webHostEnvironment)
    {
        _unitOfWork = unitOfWork;
        _webHostEnvironment = webHostEnvironment;
    }
    public IActionResult Index()
    {
        List<Product>? products = _unitOfWork.Product?.GetAll(includeProperties: "Category").ToList();
        return View(products);
    }

    public IActionResult Upsert(int? id)
    {
        ProductViewModel productViewModel = new()
        {
            Product = new Product(),
            Categories = _unitOfWork?.Category?
        .GetAll().Select(c => new SelectListItem
        {
            Text = c.Name,
            Value = c.Id.ToString(),
        })
        };
        if (id == null || id == 0)
        {
            // Create
            return View(productViewModel);
        }
        else
        {
            // Update
            productViewModel.Product = _unitOfWork?.Product?
            .Get(p => p.Id == id);
            return View(productViewModel);
        }
    }
    [HttpPost]
    public IActionResult Upsert(ProductViewModel productViewModel, IFormFile? file)
    {
        if (ModelState.IsValid)
        {
            if (file != null) 
            {
                string? wwwRootPath = _webHostEnvironment.WebRootPath;
                // Creating a filename
                string filename = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

                string imageFolderPath = Path.Combine(wwwRootPath, @"images\product");
                string imagePath = Path.Combine(imageFolderPath, filename);

                if (!string.IsNullOrEmpty(productViewModel?.Product?.ImageUrl)) 
                {
                    var oldImagePath = Path.Combine(wwwRootPath, productViewModel?.Product?.ImageUrl.TrimStart('\\'));

                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                using var fileStream = new FileStream(imagePath, FileMode.Create);
                file.CopyTo(fileStream);
                productViewModel.Product.ImageUrl = @"\images\product\" + filename;
            }

            if(productViewModel.Product.Id == null || productViewModel.Product.Id == 0)
            {
                // Create
                _unitOfWork.Product?.Add(productViewModel.Product);
                _unitOfWork.Save();
                TempData["Success"] = "Product created successfully";
                return RedirectToAction("Index");
            }
            else
            {
                // Update
                _unitOfWork.Product?.Update(productViewModel.Product);
                _unitOfWork.Save();
                TempData["Success"] = "Product updated successfully";
                return RedirectToAction("Index");
            }

        }
        else
        {
            productViewModel.Categories = _unitOfWork?.Category?
            .GetAll().Select(c => new SelectListItem
            {
                Text = c.Name,
                Value = c.Id.ToString(),
            });
            return View(productViewModel);
        }
    }

    [HttpDelete]
    public IActionResult Delete(int? id)
    {
        //if (id == null || id == 0)
        //{
        //    return NotFound();
        //}
        Product? product = _unitOfWork.Product?.Get(p => p.Id == id);
        if (product == null)
        {
            TempData["Success"] = "Error while deleting";
            //RedirectToAction("Index");
            return Json(new {success = false, message = "Product deletion failed"});
        }

        if (product.ImageUrl != null)
        {
            string? wwwRootPath = _webHostEnvironment.WebRootPath;
            var oldImagePath = Path.Combine(wwwRootPath, product.ImageUrl.TrimStart('\\'));

            if (System.IO.File.Exists(oldImagePath))
            {
                System.IO.File.Delete(oldImagePath);
            }
        }
        _unitOfWork.Product?.Remove(product);
        _unitOfWork.Save();
        TempData["Success"] = "Product deleted succesfully";
        return Json(new { success = true, message = "Product deleted succesfully" });
    }

    [HttpGet]
    public IActionResult GetAll(string filter = "")
    {
        List<Product>? products =
        _unitOfWork.Product?.GetAll(includeProperties: "Category")
         .Where(p => (
                p.Title.ToLower().Contains(filter.ToLower()) ||
                p.ISBN.ToLower().Contains(filter.ToLower()) ||
                p.Author.ToLower().Contains(filter.ToLower()) ||
                p.Category.Name.ToLower().Contains(filter.ToLower())
                ))
         .ToList();
        return Json(new { data = products });
    }

    [HttpGet]
    public IActionResult GetRange(int start, int end, string filter = "")
    {

        List<Product>? products =
        _unitOfWork.Product?
            .GetAll(includeProperties: "Category")
            .Where(p => (
                p.Title.ToLower().Contains(filter.ToLower()) ||
                p.ISBN.ToLower().Contains(filter.ToLower()) ||
                p.Author.ToLower().Contains(filter.ToLower()) ||
                p.Category.Name.ToLower().Contains(filter.ToLower())
                ))
            .Skip(start)
            .Take(end - start)
            .ToList();

        return Json(new { data = products });
    }

}