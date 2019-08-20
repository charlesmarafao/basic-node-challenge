const express = require("express");

const app = express();

app.use(express.json());

const projects = [{ id: 1, title: "Novo Projeto", tasks: [] }];

let requests = 0;

app.use((req, res, next) => {
  requests++;
  console.log(`Log - número de requisições: ${requests}`);
  next();
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  if (!project)
    return res.status(400).json({ error: "This project doesn't exist" });
  next();
}

app.get("/projects", (req, res) => {
  return res.json(projects);
});

app.post("/projects", (req, res) => {
  const { id, title } = req.body;
  projects.push({ id, title, tasks: [] });
  return res.json(projects);
});

app.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const project = projects.find(p => p.id == id);
  project.title = name;
  res.json(projects);
});

app.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);
  projects.splice(projectIndex, 1);
  res.json("success");
});

app.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);
  return res.json(projects);
});

app.listen(3000);
