using DataAccess.Data;
using DataAccess.Repository.IRepository;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Repository
{
    public class BannerRepository : Repository<Banner>, IBannerRepository
    {
        public BannerRepository(ApplicationDbContext db) : base(db) { }


        public void Update(Banner banner)
        {
            _db.Banners?.Update(banner);
        }
    }
}
