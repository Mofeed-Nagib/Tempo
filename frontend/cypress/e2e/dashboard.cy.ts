describe("Dashboard Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.wait(500);
    cy.get('[id="email"]').type("avgupta456@gmail.com");
    cy.get('[id="password"]').type("clockwork");
    cy.get('[type="submit"]').click();
  });

  afterEach(() => {
    cy.contains("Logout").click();
  });

  it("Can Log In", () => {
    cy.url().should("include", "/dashboard", { timeout: 20000 });
    cy.get('[test-id="create-task-input"]').should("exist");
  });

  it("Can Go to Labels Page", () => {
    cy.url().should("include", "/dashboard", { timeout: 20000 });
    cy.get('[test-id="labels-page-button"]').click();
    cy.contains("Labels");
  });

  it("Can Go to Calendar Page", () => {
    cy.url().should("include", "/dashboard", { timeout: 20000 });
    cy.get('[test-id="calendar-page-button"]').click();
    cy.contains("Apr");

    const date = new Date();
    const month = date.toLocaleString("default", { month: "short" });
    const year = new Date().getFullYear();
    cy.contains(month);
    cy.contains(year);
  });

  it("Page has Calendar", () => {
    cy.url().should("include", "/dashboard", { timeout: 20000 });
    cy.get('[test-id="calendar-page-button"]').click();
    cy.contains("week");
    cy.contains("day");
    cy.contains("month");
  });

  it("Can Create a Label", () => {
    cy.url().should("include", "/dashboard", { timeout: 20000 });
    cy.get('[test-id="labels-page-button"]').click();
    cy.get('[test-id="create-label-button"]').click();
    cy.contains("New Label");
  });

  it("All Task Inputs Exist", () => {
    cy.url().should("include", "/dashboard", { timeout: 20000 });
    cy.get('[test-id="create-task-input"]').should("exist");
    cy.get('[test-id="create-task-input"]').type("Problem Set 1");
    cy.get('[test-id="date-input"]').should("exist");
    cy.get('[test-id="workload-input"]').should("exist");
    cy.get('[test-id="priority-input"]').should("exist");
    cy.get('[test-id="label-input"]').should("exist");
  });

  it("Can Create a Task", () => {
    cy.url().should("include", "/dashboard", { timeout: 20000 });
    cy.get('[test-id="create-task-input"]').should("exist");
    cy.get('[test-id="create-task-input"]').type("Problem Set 1");

    cy.get('[test-id="date-input"]').should("exist");
    cy.get('[test-id="date-input"]').click();
    cy.wait(100);
    // find text 21 within div surrounded by button with type="button"
    cy.get("button[type=button]").contains("21").click();

    cy.get('[test-id="workload-input"]').should("exist");
    cy.get('[test-id="workload-input"]').click();
    cy.wait(100);
    cy.get('[test-id="workload-number-input"]').clear();
    cy.get('[test-id="workload-number-input"]').type("3");

    cy.get('[test-id="priority-input"]').should("exist");
    cy.get('[test-id="priority-input"]').click();
    cy.wait(100);
    cy.get('[role="option"]').contains("High").click();

    cy.get('[test-id="label-input"]').should("exist");
    cy.get('[test-id="label-input"]').click();
    cy.wait(100);
    cy.get('[role="option"]').contains("CPSC 439").click();

    cy.wait(100);
    cy.get('[test-id="create-task-button"]').click();

    cy.wait(100);
    cy.get('[test-id="task-item-date"]').contains("Apr 21");

    cy.wait(100);
    cy.get('[test-id="task-item-workload"]').contains("3 hours");

    cy.wait(100);
    cy.get('[test-id="task-item-priority"]').contains("High");
  });
});

export {};
