import express from 'express';
import cors from 'cors';
import AdminAuthRouter from './routes/admin.auth';
import AgentRouter from './routes/agent';
import OwnerRouter from './routes/owner';
import notverifiedProperty from './routes/notVerified';


const app = express();
app.options('*', cors()); // Enable pre-flight requests for all routes
app.use(cors({
    origin : ["https://www.admin.roomlocus.com" , "https://admin.roomlocus.com", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());


app.use("/api/v1/admin/",AdminAuthRouter);
app.use("/api/v1/admin/" , AgentRouter)
app.use("/api/v1/admin/", OwnerRouter);
app.use("/api/v1/admin/" , notverifiedProperty)


app.get("/api/health",(req,res) => {
    res.send("Hi there");
})

app.listen(3001 , () => {
    console.log("Server started on port 3001");
});