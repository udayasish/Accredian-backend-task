import express from "express";
import cors from "cors";
import referralRoutes from "./routes/referralRoutes.js";

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    limit: "16kb",
    extended: true
}));

app.use(express.static("public"));

// Add referral routes
app.use('/api/referrals', referralRoutes);

export { app };
