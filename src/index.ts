import express, { Request, Response } from "express";
import { config } from "dotenv";
import "dotenv/config";

config({ path: "./config/dev.config.env" });
import cors from "cors";
import db_connection from "./DB/connection.js";
import { globalResponse } from "./middlewares/globalResponse.js";
import router from "./modules/User/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", router);

db_connection();

app.get("/", (req: Request, res: Response) => {
  res.json({
    platformName: "Blog Platform",
    description:
      "BlogPlatform is a comprehensive solution that enables users to easily create, manage, and share blog posts.",
    features: [
      "Secure user authentication",
      "Create, edit, delete posts",
      "Organize content with categories and tags",
      "Image uploads support",
      "Advanced search and filtering",
      "Flexible API integration",
    ],
    developer: {
      name: "Mahmoud Sayed",
      email: "mahmoudsayed3576@gmail.com",
      github: "https://github.com/Mahmovdsayed",
      linkedin: "https://www.linkedin.com/in/mahmoud-sayed-a51634226/",
    },
  });
});

app.use(globalResponse);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
