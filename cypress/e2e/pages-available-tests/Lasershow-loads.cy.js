describe("Open lasershow page", () => {
  it("loads successfully", () => {
    cy.login();
    cy.visit("http://localhost:3000/lasershow-editor");
  });
});
