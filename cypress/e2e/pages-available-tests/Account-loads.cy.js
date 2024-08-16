describe("Open account page", () => {
  it("loads successfully", () => {
    cy.login();
    cy.visit("http://localhost:3000/account");
    cy.get("#root", {
      timeout: 5000,
    }).should("be.visible");

    cy.get('input[name="email"]', { timeout: 5000 }).should("have.value", "vincent.darwinkel@hotmail.nl");
  });
});
