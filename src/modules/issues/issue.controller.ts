import type { Request, Response } from "express";
import { IssueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
  const reporter_id = req.user?.id;

  const result = await IssueService.createIssueIntoDB(
    req.body,
    reporter_id as number,
  );

  res.status(201).json({
    success: true,
    message: "Issue created successfully",
    data: result,
  });
};

// get all issue
const getAllIssues = async (req: Request, res: Response) => {
  const result = await IssueService.getAllIssuesFromDB(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
};

// get single issue
const getSingleIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await IssueService.getSingleIssueFromDB(Number(id));

  res.status(200).json({
    success: true,
    data: result,
  });
};

// update issue
const updateIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await IssueService.updateIssueIntoDB(
    Number(id),
    req.body,
    req.user!,
  );

  res.status(200).json({
    success: true,
    message: "Issue updated successfully",
    data: result,
  });
};

// delete issue by maintainer
const deleteIssue = async (req: Request, res: Response) => {
  const { id } = req.params;

  await IssueService.deleteIssueFromDB(Number(id));

  res.status(200).json({
    success: true,
    message: "Issue deleted successfully",
  });
};

export const IssueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
