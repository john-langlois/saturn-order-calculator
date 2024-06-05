﻿using Dapper;
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
using SaturnCalculator.lib.Interfaces;

namespace SaturnCalculator.lib.Repositories
{
    public class SQLRepository:ISQLRepository
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
            }
            catch (Exception e)
            {
                return null;
            }
        }
        
        public async Task<int> SQLUpsertOrder(Orders ins)
        {
            int? insertedID = 0;

            var parameters = new DynamicParameters(new Dictionary<string, object> {
                { "@id", ins.ID },
                { "@tradingPartner",ins.TradingPartner},
                { "@poNumber",ins.PONumber},
                { "@trailerNumber",ins.TrailerNumber},
                { "@billLandingNo",ins.BillLandingNo},
                { "@trackingNo", ins.TrackingNo},
                { "@shipToCode",ins.ShipToCode},
                { "@carrierCode",ins.CarrierCode},
                { "@shipDate",ins.ShipDate},
                { "@shipTime",ins.ShipTime},
                { "@weight", ins.Weight},
                { "@packageType", ins.PackageType},
                { "@totalPackageCount", ins.TotalPackageCount},
                { "orderQuantity", ins.OrderQuantity},
                { "@orderCost", ins.OrderCost}
            });
            parameters.Add("@insertedID", 0, direction: ParameterDirection.Output);
            try
            {
                using IDbConnection db = new SqlConnection(ConnectionString);
                await db.ExecuteAsync("[hist].p_Orders_UPSERT", parameters, commandType: CommandType.StoredProcedure);
                insertedID = parameters.Get<int?>("@insertedID");
            }
            catch (Exception e)
            {
                return -1;
            }
            return insertedID ?? ins.ID;
        }
        
        public async Task<IEnumerable<Orders>> SQLGetAllOrders()
        {
            var id = 0;
            try
            {
                using IDbConnection db = new SqlConnection(ConnectionString);
                return await db.QueryAsync<Orders>("[hist].p_Orders_GET",new {id}, commandType: CommandType.StoredProcedure);
            }
            catch (Exception e)
            {
                return null;
            }
        }
        
        public async Task<Orders> SQLGetOrdersByID(int orderID)
        {
            var order = new Orders();
            try
            {
                using IDbConnection db = new SqlConnection(ConnectionString);
                order = await db.QueryFirstOrDefaultAsync("[hist].p_Orders_GET",new {orderID}, commandType: CommandType.StoredProcedure);
                order.LineItems = await db.QueryFirstOrDefaultAsync("[hist].p_LineItems_GET",new {orderID}, commandType: CommandType.StoredProcedure);
                order.VendorItems = await db.QueryFirstOrDefaultAsync("[hist].p_VendorItems_GET",new {orderID}, commandType: CommandType.StoredProcedure);
                return order;
            }
            catch (Exception e)
            {
                return null;
            }
        }


    }
}
