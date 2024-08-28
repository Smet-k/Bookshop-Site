using DataAccess.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.ViewModels;
using Utility;

namespace Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = SD.Role_Admin)]
    public class BannerController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public BannerController(IUnitOfWork unitOfWork, IWebHostEnvironment webHostEnvironment)
        {
            _unitOfWork = unitOfWork;
            _webHostEnvironment = webHostEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Upsert(int? id)
        {
            Banner banner = _unitOfWork?.Banners?.GetAll(b => b.Id == id).FirstOrDefault();

            if (id == null || id == 0)
            {
                // Create
                return View(new Banner());
            }
            else
            {
                // Update
                return View(banner);
            }
        }
        [HttpPost]
        public IActionResult Upsert(Banner banner, IFormFile? file)
        {
            if (ModelState.IsValid)
            {
                if (file != null)
                {
                    string? wwwRootPath = _webHostEnvironment.WebRootPath;
                    // Creating a filename
                    string filename = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

                    string imageFolderPath = Path.Combine(wwwRootPath, @"images\banner");
                    string imagePath = Path.Combine(imageFolderPath, filename);

                    if (!string.IsNullOrEmpty(banner?.ImageUrl))
                    {
                        var oldImagePath = Path.Combine(wwwRootPath, banner?.ImageUrl.TrimStart('\\'));

                        if (System.IO.File.Exists(oldImagePath))
                        {
                            System.IO.File.Delete(oldImagePath);
                        }
                    }

                    using var fileStream = new FileStream(imagePath, FileMode.Create);
                    file.CopyTo(fileStream);
                    banner.ImageUrl = @"\images\banner\" + filename;
                }

                if (banner.Id == null || banner.Id == 0)
                {
                    // Create
                    _unitOfWork.Banners?.Add(banner);
                    _unitOfWork.Save();
                    TempData["Success"] = "Banner created successfully";
                    return RedirectToAction("Index");
                }
                else
                {
                    // Update
                    _unitOfWork.Banners?.Update(banner);
                    _unitOfWork.Save();
                    TempData["Success"] = "Banner updated successfully";
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

            Banner? banner = _unitOfWork.Banners?.Get(b => b.Id == id);
            if (banner == null)
            {
                TempData["Success"] = "Error while deleting";
                //RedirectToAction("Index");
                return Json(new { success = false, message = "Banner deletion failed" });
            }

            if (banner.ImageUrl != null)
            {
                string? wwwRootPath = _webHostEnvironment.WebRootPath;
                var oldImagePath = Path.Combine(wwwRootPath, banner.ImageUrl.TrimStart('\\'));

                if (System.IO.File.Exists(oldImagePath))
                {
                    System.IO.File.Delete(oldImagePath);
                }
            }
            _unitOfWork.Banners?.Remove(banner);
            _unitOfWork.Save();
            TempData["Success"] = "Banner deleted succesfully";
            return Json(new { success = true, message = "Banner deleted succesfully" });
        }

        [HttpGet]
        public IActionResult GetAll(string filter = "")
        {
            List<Banner>? banners =
            _unitOfWork.Banners?.GetAll()
             .Where(b => (
                    b.Id.ToString().Contains(filter) ||
                    b.Name.ToLower().Contains(filter.ToLower()) ||
                    b.ImageUrl.ToLower().Contains(filter.ToLower()) 
                    ))
             .ToList();
            return Json(new { data = banners });
        }

        [HttpGet]
        public IActionResult GetRange(int start, int end, string filter = "")
        {

            List<Banner>? banners = _unitOfWork.Banners?
                .GetAll()
                .Where(b => (
                    b.Id.ToString().Contains(filter) ||
                    b.Name.ToLower().Contains(filter.ToLower()) ||
                    b.ImageUrl.ToLower().Contains(filter.ToLower())
                    ))
                .Skip(start)
                .Take(end - start)
                .ToList();

            return Json(new { data = banners });
        }
    }
}
