import fs from "fs";
import path from "path";
import sanitize from "sanitize-html";

const filePath = path.join(process.cwd(), "src", "data", "projects.json");

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

const sanitizeText = (str) =>
  sanitize(str || "", { allowedTags: [], allowedAttributes: {} }).trim();

const safeProjectUpdate = (original, incoming) => ({
  ...original,
  title: {
    en: sanitizeText(incoming.title?.en ?? original.title.en),
    fr: sanitizeText(incoming.title?.fr ?? original.title.fr),
    jp: sanitizeText(incoming.title?.jp ?? original.title.jp),
  },
  description: {
    en: sanitizeText(incoming.description?.en ?? original.description.en),
    fr: sanitizeText(incoming.description?.fr ?? original.description.fr),
    jp: sanitizeText(incoming.description?.jp ?? original.description.jp),
  },
  details: {
    en: sanitizeText(incoming.details?.en ?? original.details?.en),
    fr: sanitizeText(incoming.details?.fr ?? original.details?.fr),
    jp: sanitizeText(incoming.details?.jp ?? original.details?.jp),
  },
  technologies: Array.isArray(incoming.technologies)
    ? incoming.technologies.map(sanitizeText)
    : original.technologies,
  link: sanitizeText(incoming.link ?? original.link),
  github: sanitizeText(incoming.github ?? original.github),
  featured:
    typeof incoming.featured === "boolean"
      ? incoming.featured
      : original.featured,
});

export async function PUT(request, { params }) {
  if (!isAuthorized(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const incoming = await request.json();
    const projects = readProjects();
    const index = projects.findIndex((p) => p.id === id);

    if (index === -1) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedProject = safeProjectUpdate(projects[index], incoming);
    updatedProject.id = projects[index].id;

    projects[index] = updatedProject;
    writeProjects(projects);

    return new Response(JSON.stringify(updatedProject), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT ERROR:", error);
    return new Response(JSON.stringify({ error: "Update failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request, { params }) {
  if (!isAuthorized(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const projects = readProjects();
    const filtered = projects.filter((p) => p.id !== id);

    if (filtered.length === projects.length) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    writeProjects(filtered);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return new Response(JSON.stringify({ error: "Deletion failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
