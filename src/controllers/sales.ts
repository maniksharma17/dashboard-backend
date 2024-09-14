import { Request, Response } from "express";
import OverallStat from "../database/OverallStat.js";

export const getSales = async (req: Request, res: Response) => {
  try{
    const sales = await OverallStat.find()

    res.status(200).json(sales[0])
  }catch(e){
    res.status(404).json({error: e})
  }
}