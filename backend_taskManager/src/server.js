import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';    
import taskLogRoute from './routes/taskLogRoute.js';
import taskRoute from './routes/taskRoute.js';

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({
    limit : '100mb'
}))
app.use(express.urlencoded({
    extended : true
})) 

app.use('/api', taskRoute);
app.use('/api', taskLogRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`
        =================
        run server ${PORT}
        =================
    `)
})