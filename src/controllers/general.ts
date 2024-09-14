import { Request, Response } from "express";
import User from "../database/User.js";
import Transaction from "../database/Transaction.js";
import OverallStat from "../database/OverallStat.js";

export const getUser = async (req: Request, res: Response) => {
  try{
    const id = req.params.id;
    const user = await User.findById(id)
    res.status(200).json(user)
  } catch (e: any){
    res.status(404).json({message: e.message})
  }
}

export const getDashboard = async (req: Request, res: Response) => {
  try{
    const currentMonth = "October"
    const currentYear = "2021"
    const currentDate = "2021-10-15"

    const latestTransactions = await Transaction.find().limit(50).sort({createdOn:-1})
    const overallStats = await OverallStat.find({year: currentYear})

    const {
      totalCustomers,
      yearlySalesTotal,
      yearlyTotalSoldUnits,
      year,
      salesByCategory
    } = overallStats[0]

    const monthlyStats = overallStats[0].monthlyData.find(({month})=>{
      return month==currentMonth
    })
    const dailyStats = overallStats[0].dailyData.find(({date})=>{
      return date==currentDate
    })

    res.status(200).json({
      year,
      totalCustomers,
      yearlySalesTotal,
      yearlyTotalSoldUnits,
      salesByCategory,
      monthlyStats,
      dailyStats,
      latestTransactions
    })
  } catch (e: any){
    res.status(404).json({message: e.message})
  }
}