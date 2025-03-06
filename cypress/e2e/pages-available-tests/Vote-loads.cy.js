describe("Open vote page", () => {
  it("loads successfully", () => {
    cy.login();
    cy.visit("http://localhost:3000/vote");

    cy.get("#root", {
      timeout: 5000,
    }).should("be.visible");
  });
});
