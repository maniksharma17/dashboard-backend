import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'

import clientRoutes from './routes/client.js'
import generalRoutes from './routes/general.js'
import managementRoutes from './routes/management.js'
import salesRoutes from './routes/sales.js'

/* DATA IMPORT */
import { dataUser, dataProduct, dataProductStat, dataTransaction, dataOverallStat, dataAffiliateStat } from './data/index.js'
import Product from './database/Product.js'
import ProductStat from './database/ProductStats.js'
import Transaction from './database/Transaction.js'
import OverallStat from './database/OverallStat.js'
import AffiliateStat from './database/AffiliateStat.js'

/* CONFIGURATIONS */
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}))
app.use(morgan('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false }))
app.use(cors())

/* ROUTES */
app.use('/client', clientRoutes)
app.use('/general', generalRoutes)
app.use('/management', managementRoutes)
app.use('/sales', salesRoutes)


/* MONGOOSE CONFIG */
const DATABASE_URL = process.env.MONGODB_URI
const PORT = process.env.PORT || 3001
mongoose
  .connect(DATABASE_URL as string)
  .then(()=>{
    app.listen(PORT, ()=>{console.log('Listening on port 5001')})
    
  })
  .catch(error => {console.log(`${error}\n Error while connection.`)})

