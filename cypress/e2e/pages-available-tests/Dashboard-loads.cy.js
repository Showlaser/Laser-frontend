describe("Open dashboard page", () => {
  it("loads successfully", () => {
    cy.login();
    cy.visit("http://localhost:3000");
  });
});
