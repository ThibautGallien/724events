import fs from "fs";
import path from "path";
import { Readable } from "stream";
import Busboy from "busboy";
import sanitize from "sanitize-html";

const filePath = path.join(process.cwd(), "src", "data", "projects.json");
const imagesDir = path.join(process.cwd(), "public", "images");

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const readProjects = () => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

const writeProjects = (projects) => {
  fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), "utf-8");
};

const isAuthorized = (req) => {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  return token && token === process.env.ADMIN_TOKEN;
};

const sanitizeFilename = (name) =>
  path.basename(name).replace(/[^a-z0-9.\-_]/gi, "_");

const parseSafeJSON = (str, fallback = {}) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

const sanitizeText = (str) =>
  sanitize(str || "", {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

const validateAndSanitizeProject = (fields) => {
  const title = parseSafeJSON(fields.title);
  const description = parseSafeJSON(fields.description);
  const technologies = parseSafeJSON(fields.technologies, []);
  const details = parseSafeJSON(fields.details, {});

  return {
    title: {
      en: sanitizeText(title.en),
      fr: sanitizeText(title.fr),
      jp: sanitizeText(title.jp),
    },
    description: {
      en: sanitizeText(description.en),
      fr: sanitizeText(description.fr),
      jp: sanitizeText(description.jp),
    },
    details: {
      en: sanitizeText(details.en),
      fr: sanitizeText(details.fr),
      jp: sanitizeText(details.jp),
    },
    technologies: Array.isArray(technologies)
      ? technologies.map(sanitizeText)
      : [],
    link: sanitizeText(fields.link),
    github: sanitizeText(fields.github),
    featured: fields.featured === "true",
  };
};

export async function GET() {
  try {
    const data = readProjects();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to load projects." }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const fields = {};
    let imageUrl = "";
    const fileWrites = [];

    const busboy = Busboy({
      headers: Object.fromEntries(req.headers),
    });

    const busboyFinished = new Promise((resolve, reject) => {
      busboy.on("file", (fieldname, file, info) => {
        const rawFilename = typeof info === "object" ? info.filename : info;
        if (!rawFilename || typeof rawFilename !== "string") {
          return reject(new Error("Invalid filename"));
        }

        const safeFilename = sanitizeFilename(rawFilename);
        const extension = path.extname(safeFilename).toLowerCase();
        if (![".jpg", ".jpeg", ".png", ".webp"].includes(extension)) {
          return reject(new Error("Unsupported file type"));
        }

        const saveTo = path.join(imagesDir, safeFilename);
        imageUrl = `/images/${safeFilename}`;

        const writeStream = fs.createWriteStream(saveTo);
        file.pipe(writeStream);

        fileWrites.push(
          new Promise((res, rej) => {
            writeStream.on("finish", res);
            writeStream.on("error", rej);
          })
        );
      });

      busboy.on("field", (name, value) => {
        fields[name] = value;
      });

      busboy.on("finish", resolve);
      busboy.on("error", reject);
    });

    const nodeStream = Readable.fromWeb(req.body);
    nodeStream.pipe(busboy);

    await busboyFinished;
    await Promise.all(fileWrites);

    const validated = validateAndSanitizeProject(fields);

    const newProject = {
      id: Date.now().toString(),
      ...validated,
      image: imageUrl,
    };

    const projects = readProjects();
    projects.push(newProject);
    writeProjects(projects);

    return new Response(JSON.stringify(newProject), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return new Response(
      JSON.stringify({ error: "Failed to upload project." }),
      { status: 500 }
    );
  }
}
