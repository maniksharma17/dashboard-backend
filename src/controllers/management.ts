import { Request, Response } from "express";
import User from "../database/User.js";
import mongoose from "mongoose";
import AffiliateStat from "../database/AffiliateStat.js";
import Transaction from "../database/Transaction.js";

export const getAdmins = async (req: Request, res: Response) => {
  try{
    const admins = await User.find({role: "admin"}).select("-password")
    res.status(200).json(admins)
  }catch(e){
    res.status(404).json({error: e})
  }
}

export const getUserPerformance = async (req: Request, res: Response) => {
  try{
    const {id} = req.params
    const userWithStats = await User.aggregate([
      { $match: {_id: new mongoose.Types.ObjectId(id)} },
      {
        $lookup: {
          from: "affiliatestats",
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats"
        }
      },
      { $unwind: "$affiliateStats" }
    ])

    const saleTransactions = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map(id => {
        return Transaction.findById(id)
      })
    )

    const filteredSaleTransactions = saleTransactions.filter(
      (t) => t !== null
    )

    res.status(200).json({user: userWithStats[0], sales: filteredSaleTransactions})
  }catch(e){
    res.status(404).json({error: e})
  }
}