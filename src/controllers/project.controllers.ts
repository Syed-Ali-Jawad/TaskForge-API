import type { Request, Response } from "express";
import {
  addProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProjectById,
} from "../services/project.services";

const addProjectHandler = async (req: Request, res: Response) => {
  const { workspaceId } = getParams(req.params);

  const addedProject = await addProject(workspaceId, req.body);

  return res.status(201).json({
    message: `${addedProject.name}[${addedProject.shortKey}] is added into workspace (${addedProject.workspace.name})`,
  });
};

const getProjectsHandler = async (req: Request, res: Response) => {
  const { workspaceId } = getParams(req.params);

  const projects = await getProjects(workspaceId);

  return res.status(200).json({ projects });
};

const getProjectByIdHandler = async (req: Request, res: Response) => {
  const { workspaceId, projectId } = getParams(req.params);

  const project = await getProjectById(workspaceId, projectId);

  return res.status(200).json(project);
};

const updateProjectByIdHandler = async (req: Request, res: Response) => {
  const { workspaceId, projectId } = getParams(req.params);

  const updatedProject = await updateProjectById(
    projectId,
    workspaceId,
    req.body,
  );

  return res.status(200).json(updatedProject);
};

const deleteProjectHandler = async (req: Request, res: Response) => {
  const { projectId } = getParams(req.params);

  const deletedProject = await deleteProject(projectId);

  return res
    .status(200)
    .json({ message: `${deletedProject.name} has been deleted` });
};

export {
  addProjectHandler,
  getProjectsHandler,
  getProjectByIdHandler,
  updateProjectByIdHandler,
  deleteProjectHandler,
};

const getParams = (params: any) => ({
  workspaceId: params.workspaceId?.[0] || "",
  projectId: params.id?.[0] || "",
});
