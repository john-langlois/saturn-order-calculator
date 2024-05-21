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
        public string PartNo { get; set; }
        public string PartName { get; set; }
        public string CompanyName { get; set; }
        public string CompanyCode { get; set; }
        public double CoilBlankPrice { get; set; }
        public string CoilBlankUnitType { get; set; }
    }
}
