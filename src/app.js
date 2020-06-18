const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests (request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);
  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}

function validateRepositoryId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.' });
  }
  return next();
}

app.use(logRequests);
//app.use("/repositories/:id", validateRepositoryId);

app.get("/repositories", (request, response) => {
  const { title, id } = request.query;
  const results = title 
    ? repositories.filter(repository => repository.title.includes(title))
    : id 
      ? repositories.filter(repository => repository.id == id)
      : repositories;
  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, techs, url } = request.body;
  const repository = {
    id: uuid(),
    title,
    techs,
    url, //'https://github.com/Rocketseat/bootcamp-gostack-desafios',
    likes: 0
  }
  repositories.push(repository);
  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'});
  }

  const { likes } = repositories[repositoryIndex];

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository;

  response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'});
  }

  repositories.splice(repositoryIndex, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'});
  }

  const { title, url, techs, likes } = repositories[repositoryIndex];
  likes = likes + 1;
  
  const  = repositories[repositoryIndex];
  
  const repository = { 
    id, 
    title, 
    url, 
    techs,
    likes
  };

  repositories[repositoryIndex] = repository;

  response.json(repository);
});

module.exports = app;
