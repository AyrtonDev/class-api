import express, { Request, Response, ErrorRequestHandler } from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { MulterError } from "multer";
import apiRoutes from "./routes/api";

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

app.use(apiRoutes);

app.use((req: Request, res: Response) => {
  res.status(404);
  res.json({
    error: "Endpoint not found",
  });
});

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  res.status(400);

  if (err instanceof MulterError) {
    res.json({
      error: err.code,
    });
  } else {
    console.log(err);
    res.json({
      error: "An error occurred.",
    });
  }
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
