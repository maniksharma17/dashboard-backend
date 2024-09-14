import { Request, Response } from "express";
import Product from "../database/Product.js"
import ProductStat from "../database/ProductStats.js";
import User from "../database/User.js";
import Transaction from "../database/Transaction.js";
import { SortOrder } from "mongoose";
import { countryToAlpha2, countryToAlpha3 } from "country-to-iso";

export const getProducts = async (req: Request, res: Response) => {
  try{
    const products = await Product.find();
    const productsWithStats = await Promise.all(
      products.map(async product => {
        const stat = await ProductStat.find({
          productId: product.id
        })

        return {
          ...product,
          stat
        }
      })
    )
    
    res.status(200).json(productsWithStats)
    
  } catch(e){
    res.status(404).json({error: e})
  }
}

export const getCustomers = async (req: Request, res: Response) => {
  try{
    const customers = await User.find({role: "user"}).select("-password");
    res.status(200).json(customers);
  } catch(e){
    res.status(404).json({error: e})
  }
}

export const getTransactions = async (req: Request, res: Response) => {
  try{
    // (sort) {'field': 'userId', 'sort': 'desc'}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // (formatted sort) { userId: -1 }
    const generateSort = () => {
      const parsedSort = JSON.parse(sort as string)
      const sortFormatted: {[key: string]: SortOrder} = {
        [parsedSort.field]: (parsedSort.sort=="asc")? 1 : -1
      }

      return sortFormatted
    }

    const sortFormatted = Boolean(sort)? generateSort() : {}

    const transactions = await Transaction.find({
      "$or": [
        {cost: {$regex: new RegExp(search as string, "i")}},
        {userId: {$regex: new RegExp(search as string, "i")}}
      ]
    })
    .sort(sortFormatted)
    .skip(Number(page) * Number(pageSize))
    .limit(Number(pageSize))

    const total = await Transaction.countDocuments({
      userId: { $regex: search, $options: "i" }  
    })

    res.status(200).json({transactions, total})

  } catch(e){
    res.status(404).json({error: e})
  }
}

export const getGeography = async (req: Request, res: Response) => {
  try{
    const users = await User.find()
    const mappedLocations = users.reduce((acc, {country}) => {
      const countryISO3 = countryToAlpha3(country as string)
      if(!acc[countryISO3 as string]) acc[countryISO3 as string] = 0
      acc[countryISO3 as string]++

      return acc
    }, {})

    const formattedLocations = Object.entries(mappedLocations).map(
      (([country, count]) => {
        return {id: country, value: count}
      })
    )

    res.status(200).json(formattedLocations)

  } catch(e){
    res.status(404).json({error: e})
  }
}