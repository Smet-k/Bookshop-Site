using DataAccess.Data;
using DataAccess.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        protected ApplicationDbContext _db;

        // Might cause some issues cuz of set
        public ICategoryRepository? Category { get; private set; }
        public IProductRepository? Product { get; private set; }
        public ICompanyRepository? Company { get; private set; }
        public IShoppingCartRepository ShoppingCart { get; private set; }
        public IApplicationUserRepository? ApplicationUser { get; private set; }
        public IOrderHeaderRepository? OrderHeader{ get; private set;}
        public IOrderDetailRepository? OrderDetail { get; private set; }
        public IBannerRepository? Banners { get; private set; }
        public UnitOfWork(ApplicationDbContext db)
        {
            _db = db;
            Category = new CategoryRepository(_db);
            Product = new ProductRepository(_db);
            Company = new CompanyRepository(_db);
            ShoppingCart = new ShoppingCartRepository(_db);
            ApplicationUser = new ApplicationUserRepository(_db);
            OrderHeader = new OrderHeaderRepository(_db);
            OrderDetail = new OrderDetailRepository(_db);
            Banners = new BannerRepository(_db);
        }

        public void Save()
        {
            _db.SaveChanges();
        }
    }
}
