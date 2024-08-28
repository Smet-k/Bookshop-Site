using DataAccess.Data;
using DataAccess.Repository;
using DataAccess.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Models;
using Models.ViewModels;
using Utility;

namespace Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = SD.Role_Admin)]
    public class CategoryController : Controller
    {

        //private readonly ApplicationDbContext _db;
        private readonly IUnitOfWork _unitOfWork;

        public CategoryController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        public IActionResult Index()
        {
            List<Category>? categories = _unitOfWork.Category?.GetAll().ToList();

            return View(categories);
        }


        public IActionResult Upsert(int? id)
        {
            Category category = _unitOfWork?.Category?.GetAll(c => c.Id == id).FirstOrDefault();

            if (id == null || id == 0)
            {
                // Create
                return View(new Category());
            }
            else
            {
                // Update
                return View(category);
            }
        }
        [HttpPost]
        public IActionResult Upsert(Category category)
        {
            if (ModelState.IsValid)
            {
                if (category.Id == null || category.Id == 0)
                {
                    // Create
                    _unitOfWork.Category?.Add(category);
                    _unitOfWork.Save();
                    TempData["Success"] = "Category created successfully";
                    return RedirectToAction("Index");
                }
                else
                {
                    // Update
                    _unitOfWork.Category?.Update(category);
                    _unitOfWork.Save();
                    TempData["Success"] = "Category updated successfully";
                    return RedirectToAction("Index");
                }

            }
            else
            {
                return View();
            }
        }


        [HttpDelete]
        public IActionResult Delete(int? id)
        {

            Category? category = _unitOfWork.Category?.Get(p => p.Id == id);
            if (category == null)
            {
                TempData["Success"] = "Error while deleting";
                //RedirectToAction("Index");
                return Json(new { success = false, message = "Category deletion failed" });
            }


            _unitOfWork.Category?.Remove(category);
            _unitOfWork.Save();
            TempData["Success"] = "Product deleted succesfully";
            return Json(new { success = true, message = "Category deleted succesfully" });
        }

        [HttpGet]
        public IActionResult GetAll(string filter = "")
        {
            List<Category>? categories =
            _unitOfWork.Category?.GetAll()
             .Where(p => (
                    p.Id.ToString().Contains(filter) ||
                    p.Name.ToLower().Contains(filter.ToLower())
                    ))
             .ToList();
            return Json(new { data = categories });
        }

        [HttpGet]
        public IActionResult GetRange(int start, int end, string filter = "")
        {

            List<Category>? categories =
            _unitOfWork.Category?
                .GetAll()
                .Where(p => (
                    p.Id.ToString().Contains(filter) ||
                    p.Name.ToLower().Contains(filter.ToLower())
                    ))
                .Skip(start)
                .Take(end - start)
                .ToList();

            return Json(new { data = categories });
        }

    }
}
