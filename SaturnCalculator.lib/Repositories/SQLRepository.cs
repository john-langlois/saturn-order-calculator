using Dapper;
using Microsoft.Extensions.Options;
using SaturnCalculator.entity.Models;
using SaturnCalculator.lib.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace SaturnCalculator.lib.Repositories
{
    public class SQLRepository
    {
        private readonly string ConnectionString;
        public SQLRepository(IOptionsMonitor<AppSettings> options) {
            this.ConnectionString = options.CurrentValue.DbConnection;
        }

        public async Task<int> SQLUpsertOrderInfo(OrderInfo ins)
        {
            int? insertedID = 0;

            var parameters = new DynamicParameters(new Dictionary<string, object> {
                { "@id", ins.ID },
                { "@jobNo",ins.JobNo},
                { "@poNo",ins.PoNo},
                { "@ppu",ins.PPU},
                { "@partNo",ins.PartNo},
                { "@partName", ins.PartName},
                { "@companyCode",ins.CompanyCode},
                { "@companyName",ins.CompanyName},
                { "@coilBlankPrice",ins.CoilBlankPrice},
                { "@coilBlankUnitType",ins.CoilBlankUnitType},
            });
            parameters.Add("@insertedID", 0, direction: ParameterDirection.Output);
            try
            {
                using IDbConnection db = new SqlConnection(ConnectionString);
                await db.ExecuteAsync("[ref].p_OrderInfo_UPSERT", parameters, commandType: CommandType.StoredProcedure);
                insertedID = parameters.Get<int?>("@insertedID");
            }
            catch (Exception e)
            {
                return -1;
            }
            return insertedID ?? ins.ID;
        }

        public async Task<IEnumerable<OrderInfo>> SQLGetAllOrderInfo()
        {
            try
            {
                using IDbConnection db = new SqlConnection(ConnectionString);
                return await db.QueryAsync<OrderInfo>("[ref].p_OrderInfo_GET", commandType: CommandType.StoredProcedure);
                // return new List<OrderInfo>()
                // {
                //     new OrderInfo()
                //     {
                //         ID = 1,
                //         PartNo = "3394",
                //         PPU = 12.7086,
                //         CompanyCode = "1151",
                //         CompanyName = "Formet",
                //         JobNo = "PR0029",
                //         PoNo = "5500115185",
                //         CoilBlankPrice = 0.8795,
                //         CoilBlankUnitType = "kg",
                //         PartName = "Bottom Housing"
                //     },
                //     new OrderInfo()
                //     {
                //         ID = 2,
                //         PartNo = "3393",
                //         PPU = 8.1864,
                //         CompanyCode = "1151",
                //         CompanyName = "Formet",
                //         JobNo = "PR0028",
                //         PoNo = "5500115184",
                //         CoilBlankPrice = 0.8735,
                //         CoilBlankUnitType = "kg",
                //         PartName = "Top Shield"
                //     },
                //     new OrderInfo()
                //     {
                //         ID = 3,
                //         PartNo = "G2104",
                //         PPU = 9.5191,
                //         CompanyCode = "1151",
                //         CompanyName = "Formet",
                //         JobNo = "PR0033",
                //         PoNo = "5500167707",
                //         CoilBlankPrice = 0.6320,
                //         CoilBlankUnitType = "lb",
                //         PartName = "Reinf Quarter Panel RH"
                //     },
                //     new OrderInfo()
                //     {
                //         ID = 4,
                //         PartNo = "G2105",
                //         PPU = 9.5188,
                //         CompanyCode = "1151",
                //         CompanyName = "Formet",
                //         JobNo = "PR0033",
                //         PoNo = "5500167708",
                //         CoilBlankPrice = 0.6320,
                //         CoilBlankUnitType = "lb",
                //         PartName = "Reinf Quarter Panel LH"
                //     }
                // };
            }
            catch (Exception e)
            {
                return null;
            }
        }


    }
}
