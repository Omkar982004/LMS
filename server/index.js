//Step 1 : import express
import express from 'express';

//step 5 : import db from config
import connectDB from './config/db.js';


//import userRouter
import users from './routes/userRoutes.js'

//step2 : create app using express
const app = express();

//step3 : set port
const PORT = process.env.PORT || 5000;


// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended : false}));


// Connect to MongoDB
connectDB();

//Route proxy middleware
app.use('/api/users' , users);

//step 4 : start the server at PORT
app.listen(PORT , () => {
    console.log(`Server running on PORT ${PORT}`);
})
