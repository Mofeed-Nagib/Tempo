import { Client } from "pg";

import "@testing-library/jest-dom/";

const SUPABASE_PASSWORD = process.env.SUPABASE_PASSWORD;

const wrapSQL = (sql) => `begin; select plan(1); ${sql}; select * from finish(); rollback;`;

const hasTable = (table) => `select has_table('${table}')`;
const hasColumn = (table, column) => `select has_column('${table}','${column}')`;
const isPK = (table, column) => `select col_is_pk('${table}','${column}')`;
const isFK = (table, column) => `select col_is_fk('${table}','${column}')`;

describe("DB Test", () => {
  let client;

  beforeAll(async () => {
    client = new Client(
      `postgres://postgres:${SUPABASE_PASSWORD}@db.piqlrqkrapytusmoajsn.supabase.co:6543/postgres`
    );

    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  // Check that we have our tables
  it("should have users table", async () => {
    const res = await client.query(wrapSQL(hasTable("users")));
    const output = !res[2].rows[0].has_table.includes("Failed");
    expect(output).toBe(true);
  });

  it("should have tasks table", async () => {
    const res = await client.query(wrapSQL(hasTable("tasks")));
    const output = !res[2].rows[0].has_table.includes("Failed");
    expect(output).toBe(true);
  });

  it("should have labels table", async () => {
    const res = await client.query(wrapSQL(hasTable("labels")));
    const output = !res[2].rows[0].has_table.includes("Failed");
    expect(output).toBe(true);
  });

  it("should have metrics table", async () => {
    const res = await client.query(wrapSQL(hasTable("metrics")));
    const output = !res[2].rows[0].has_table.includes("Failed");
    expect(output).toBe(true);
  });

  // Check the columns of the users table
  it("user_id should be the primary key of the users table", async () => {
    const query = wrapSQL(isPK("users", "user_id"));
    const res = await client.query(query);
    const output = !res[2].rows[0].col_is_pk.includes("Failed");
    expect(output).toBe(true);
  });

  it("users should have a gcal_auth_token column", async () => {
    const query = wrapSQL(hasColumn("users", "gcal_auth_token"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  it("users should have a created_at column", async () => {
    const query = wrapSQL(hasColumn("users", "created_at"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  it("users should have a webhook_resource_id column", async () => {
    const query = wrapSQL(hasColumn("users", "webhook_resource_id"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  // Check the columns of the tasks table
  it("id should be the primary key of the tasks table", async () => {
    const query = wrapSQL(isPK("tasks", "id"));
    const res = await client.query(query);
    const output = !res[2].rows[0].col_is_pk.includes("Failed");
    expect(output).toBe(true);
  });

  it("label should be the foreign key in the tasks table to the labels table", async () => {
    const query = wrapSQL(isFK("tasks", "label"));
    const res = await client.query(query);
    const output = !res[2].rows[0].col_is_fk.includes("Failed");
    expect(output).toBe(true);
  });

  it("user_id should be the foreign key in the tasks table to the user table", async () => {
    const query = wrapSQL(isFK("tasks", "user_id"));
    const res = await client.query(query);
    const output = !res[2].rows[0].col_is_fk.includes("Failed");
    expect(output).toBe(true);
  });

  it("tasks should have a title column", async () => {
    const query = wrapSQL(hasColumn("tasks", "title"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  it("tasks should have a description column", async () => {
    const query = wrapSQL(hasColumn("tasks", "description"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  it("tasks should have a start_date column", async () => {
    const query = wrapSQL(hasColumn("tasks", "start_date"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  it("tasks should have a end_date column", async () => {
    const query = wrapSQL(hasColumn("tasks", "end_date"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  it("tasks should have a expected_duration column", async () => {
    const query = wrapSQL(hasColumn("tasks", "expected_duration"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  it("tasks should have a curr_progress column", async () => {
    const query = wrapSQL(hasColumn("tasks", "curr_progress"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  it("tasks should have a completed column", async () => {
    const query = wrapSQL(hasColumn("tasks", "completed"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  it("tasks should have a actual_duration column", async () => {
    const query = wrapSQL(hasColumn("tasks", "actual_duration"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  it("tasks should have a priority column", async () => {
    const query = wrapSQL(hasColumn("tasks", "priority"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  it("tasks should have a created_at column", async () => {
    const query = wrapSQL(hasColumn("tasks", "created_at"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  // Check the columns of the labels table
  it("id should be the primary key of the labels table", async () => {
    const query = wrapSQL(isPK("labels", "id"));
    const res = await client.query(query);
    const output = !res[2].rows[0].col_is_pk.includes("Failed");
    expect(output).toBe(true);
  });

  it("user_id should be the foreign key in the labels table to the user table", async () => {
    const query = wrapSQL(isFK("labels", "user_id"));
    const res = await client.query(query);
    const output = !res[2].rows[0].col_is_fk.includes("Failed");
    expect(output).toBe(true);
  });

  it("labels should have a created_at column", async () => {
    const query = wrapSQL(hasColumn("labels", "created_at"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  it("labels should have a name column", async () => {
    const query = wrapSQL(hasColumn("labels", "name"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  it("labels should have a description column", async () => {
    const query = wrapSQL(hasColumn("labels", "description"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  it("labels should have a color column", async () => {
    const query = wrapSQL(hasColumn("labels", "color"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  // Check the columns of the metrics table
  it("id should be the primary key of the metrics table", async () => {
    const query = wrapSQL(isPK("metrics", "id"));
    const res = await client.query(query);
    const output = !res[2].rows[0].col_is_pk.includes("Failed");
    expect(output).toBe(true);
  });

  it("metrics should have a total column", async () => {
    const query = wrapSQL(hasColumn("metrics", "total"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });

  it("metrics should have a reward column", async () => {
    const query = wrapSQL(hasColumn("metrics", "reward"));
    const res = await client.query(query);
    const output = !res[2].rows[0].has_column.includes("Failed");
    expect(output).toBe(true);
  });
});
