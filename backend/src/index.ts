import express from "express";
import type { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Minis } from "./minis/Minis.js";
import type { ProjectCompileData } from "./dto/ProjectCompile.js";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

Minis.getInstance().init();

const app = express();
const PORT = 3000;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:4173', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Swagger configuration
const isProduction = process.env.NODE_ENV === "production";
const apiFiles = isProduction 
  ? [join(__dirname, "**/*.js")]
  : [join(process.cwd(), "src", "**/*.ts")];

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API",
      version: "1.0.0",
      description: "API documentation for Backend",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
  },
  apis: apiFiles,
};

let swaggerSpec: any;
try {
  swaggerSpec = swaggerJsdoc(swaggerOptions);
} catch (error) {
  console.error("Błąd podczas generowania dokumentacji Swagger:", error);
  swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "Backend API",
      version: "1.0.0",
      description: "API documentation for Backend",
    },
  };
}

// Swagger UI endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*
GET  "/project/sketch/source/:id/:name"
POST "/project/sketch/compile/:id"
GET  "/project/sketch/list/:id"
GET  "/project/list"
*/


/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Returns a greeting message
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           text/plain:
 *             example: Hello from TypeScript backend!
 */
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript backend!");
});

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Test endpoint
 *     description: Returns a test message
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           text/plain:
 *             example: Hello from TypeScript backend22!
 */
app.get("/test", (req: Request, res: Response) => {
  res.send("Hello from TypeScript backend22!");
});

/**
 * @swagger
 * /project/sketch/source/{id}/{name}:
 *   get:
 *     summary: Get sketch
 *     description: Returns a sketch
 *     tags: [General]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *         example: project1
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Sketch name
 *         example: sketch1.blockly
 *     responses:
 *       200:
 *         description: Success response with sketch
 *         content:
 *           text/plain:
 *             example: const sketch = project.loadSketch(name);
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Project or sketch not found
 *       500:
 *         description: Internal server error
 */
app.get("/project/sketch/source/:id/:name", (req: Request, res: Response) => {
  const id = req.params.id;
  const name = req.params.name;

  try {
      if (!id || !name) {
        res.status(400).send("Invalid request");
        return;
      }
      const project = Minis.getInstance().getProject(id);
      if (project) {
        const sketch = project.loadSketch(name);
        if (sketch) {
          res.status(200).send(sketch);
        } else {
          res.status(404).send("Sketch not found");
        }
      } else {
        res.status(404).send("Project not found");
      }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

/**
 * @swagger
 * /project/sketch/compile/{id}:
 *   post:
 *     summary: Compile sketch
 *     description: Compiles a sketch
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           text/plain:
 *             example: Compilation successful
 *       600:
 *         description: Compilation failed
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
app.post("/project/sketch/compile/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send("Invalid request");
    console.log("111111");
    return;
  }
  let compileData : ProjectCompileData = req.body;
  if (!compileData) {
    res.status(400).send("Invalid request");
    console.log("222222");
    return;
  }
  console.log(compileData);
  //try {
    const project = Minis.getInstance().getProject(id);
    if (project) {
      const status = project.compile(compileData);
      if (status === 0) {
        res.status(200).send("Compilation successful");
      } else {
        res.status(600).send("Compilation failed");
      }
    } else {
      res.status(404).send("Project not found");
    }
  //} catch (error) {
  //  res.status(500).send("Internal server error");
  //}
});


/** 
 * @swagger
 * /project/sketch/list/{id}:
 *   get:
 *     summary: Get sketch list
 *     description: Returns a list of sketches for a given project
 *     tags: [General]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *         example: project1
 *     responses:
 *       200:
 *         description: Success response with sketch list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *             example: ["sketch1.blockly", "sketch2.blockly"]
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Project not found
 */
app.get("/project/sketch/list/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  console.log("id:" + id);
  if (!id) {
    res.status(400).send("Invalid request");
    console.log("111111");
    return;
  }
  
  const project = Minis.getInstance().getProject(id);
  if (project) {
    const sketchList = project.getSketchList();
    res.status(200).send(sketchList);
  } else {
    res.status(404).send("Project not found");
  }
});

/**
 * @swagger
 * /project/list:
 *   get:
 *     summary: Get project list
 *     description: Returns a list of projects
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Success response with project list
 *         content:
 *           application/json:
 *             example: [{id: "project1", name: "Project 1"}, {id: "project2", name: "Project 2"}]
 */
app.get("/project/list", (req: Request, res: Response) => {
  const projectList = Minis.getInstance().getProjectList();
  res.status(200).send(projectList);
});

/**
 * @swagger
 * /project/hexfile/{id}:
 *   get:
 *     summary: Get hex file
 *     description: Returns a hex file for a given project
 *     tags: [General]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *         example: project1
 *     responses:
 *       200:
 *         description: Success response with hex file
 *         content:
 *           application/octet-stream:
 *             example: hex file content
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Project not found
 */
app.get("/project/hexfile/:id", (req: Request, res: Response) => {    
  const id = req.params.id;
  if (!id) {
    res.status(400).send("Invalid request");
    return;
  }
  try {
      const project = Minis.getInstance().getProject(id);
      if (project) {
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader("Content-Disposition", "attachment; filename=test.bin");
    
        const stream = fs.createReadStream(project.getHexFilePath());
        stream.pipe(res);  
      } else {
        res.status(404).send("Project not found");
      }  
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  });

app.listen(PORT, () => {
  console.log(`Server działa na http://localhost:${PORT}`);
  console.log(`Swagger docs dostępne na http://localhost:${PORT}/api-docs`);
}).on("error", (error: Error & { code?: string }) => {
  if (error.code === "EADDRINUSE") {
    console.error(`\n❌ Port ${PORT} jest już zajęty!`);
    console.error(`Aby zakończyć proces na porcie ${PORT}, uruchom:`);
    console.error(`  lsof -ti:${PORT} | xargs kill`);
    console.error(`lub:`);
    console.error(`  kill $(lsof -ti:${PORT})\n`);
  } else {
    console.error("Błąd podczas uruchamiania serwera:", error);
  }
  process.exit(1);
});

// Handle uncaught errors
process.on("uncaughtException", (error: Error) => {
  console.error("Nieobsłużony błąd:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.error("Nieobsłużona odrzucona obietnica:", reason);
  process.exit(1);
});

console.log("Backend started");