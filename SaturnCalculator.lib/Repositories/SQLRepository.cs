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
                { "@vendorItemNo",ins.VendorItemNo},
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
            }
            catch (Exception e)
            {
                return null;
            }
        }


    }
}
