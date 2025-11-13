//Step 1 : import express
import express from 'express';

//step 5 : import db from config
import connectDB from './config/db.js';

import cors from 'cors';


//import userRouter
import users from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import enrollmentRoutes from './routes/enrollmentRoutes.js'
import moduleRoutes from './routes/moduleRoutes.js'
import assignmentRoutes from './routes/assignmentRoutes.js'

//step2 : create app using express
const app = express();

//step3 : set port
const PORT = process.env.PORT || 5000;

// Allow frontend (Vite) requests
app.use(
  cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended : false}));


// Connect to MongoDB
connectDB();

//Route proxy middleware
app.use('/api/users' , users);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/courses', moduleRoutes);
app.use('/api//modules/:moduleId/assignments', assignmentRoutes)

//step 4 : start the server at PORT
app.listen(PORT , () => {
    console.log(`Server running on PORT ${PORT}`);
})
