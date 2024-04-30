using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SaturnCalculator.entity.Models
{
    public class OrderInfo
    {
        public int ID { get; set; }
        public string JobNo { get; set; }
        public string PoNo { get; set; }
        public double PPU { get; set; }
        public string VendorItemNo { get; set; }
    }
}
