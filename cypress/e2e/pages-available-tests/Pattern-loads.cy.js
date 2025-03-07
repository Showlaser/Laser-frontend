describe("Open pattern page", () => {
  it("loads successfully", () => {
    cy.login();
    cy.visit("http://localhost:3000/pattern-editor");
  });
});
