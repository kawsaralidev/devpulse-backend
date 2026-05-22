import { pool } from "../../db";
import type { TIssue } from "../../interface/issue.interface";
import type { TJwtPayload } from "../../type";

// create issue
const createIssueIntoDB = async (payload: TIssue, reporter_id: number) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `
    INSERT INTO issues
    (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [title, description, type, reporter_id],
  );

  return result.rows[0];
};

// get all issue services
const getAllIssuesFromDB = async (query: Record<string, unknown>) => {
  let sql = `SELECT * FROM issues`;

  const conditions: string[] = [];

  // filtering
  if (query.type) {
    conditions.push(`type = '${query.type}'`);
  }

  if (query.status) {
    conditions.push(`status = '${query.status}'`);
  }

  // where clause
  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(" AND ");
  }

  // sorting
  if (query.sort === "oldest") {
    sql += ` ORDER BY created_at ASC`;
  } else {
    sql += ` ORDER BY created_at DESC`;
  }

  const issueResult = await pool.query(sql);

  const issues = issueResult.rows;

  // reporter info add
  const finalData = await Promise.all(
    issues.map(async (issue) => {
      const userResult = await pool.query(
        `
        SELECT id, name, role
        FROM users
        WHERE id = $1
        `,
        [issue.reporter_id],
      );

      return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,

        reporter: userResult.rows[0],

        created_at: issue.created_at,
        updated_at: issue.updated_at,
      };
    }),
  );

  return finalData;
};

// get single issue service
const getSingleIssueFromDB = async (id: number) => {
  // issue find
  const issueResult = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [id],
  );

  const issue = issueResult.rows[0];

  // reporter find
  const userResult = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = $1
    `,
    [issue.reporter_id],
  );

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,

    reporter: userResult.rows[0],

    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

// update issue to database
const updateIssueIntoDB = async (
  id: number,
  payload: Partial<TIssue>,
  user: TJwtPayload,
) => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [id],
  );

  const issue = issueResult.rows[0];

  // issue not found
  if (!issue) {
    throw Object.assign(new Error("Issue not found"), { statusCode: 404 });
  }

  // contributor rules
  if (user.role === "contributor") {
    if (issue.reporter_id !== user.id) {
      throw Object.assign(new Error("You cannot update others issue"), {
        statusCode: 403,
      });
    }

    if (issue.status !== "open") {
      throw Object.assign(new Error("You cannot update closed issue"), {
        statusCode: 409,
      });
    }
  }

  if (user.role === "maintainer" && !payload.status) {
    payload.status = "in_progress";
  }

  const { title, description, type, status } = payload;

  const result = await pool.query(
    `
    UPDATE issues
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      type = COALESCE($3, type),
      status = COALESCE($4, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *
    `,
    [title, description, type, status, id],
  );

  return result.rows[0];
};
// delete issue by maintainer to database
const deleteIssueFromDB = async (id: number) => {
  // check issue exists
  const issueResult = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [id],
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

  // delete issue
  await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1
    `,
    [id],
  );
};

export const IssueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
};
