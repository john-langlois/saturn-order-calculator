using SaturnCalculator.entity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SaturnCalculator.lib.Interfaces
{
    public interface ISQLRepository
    {
        public Task<IEnumerable<OrderInfo>> SQLGetAllOrderInfo();
        public Task<int> SQLUpsertOrderInfo();
    }
}
