describe("Open login page", () => {
  it("loads successfully", () => {
    cy.visit("http://localhost:3000/login");
  });
});
