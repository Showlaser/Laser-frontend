describe("Login test", () => {
  it("Logs the user in", () => {
    const username = "TestUser";
    const password = "qwerty";

    cy.visit("http://localhost:3000/login");
    cy.get("input[name=username]").clear().type(username);
    cy.get("input[name=password]").clear().type(`${password}{enter}`);
    cy.get("#root", {
      timeout: 5000,
    }).should("be.visible");

    cy.url().should("include", "http://localhost:3000");
    cy.contains("Dashboard");
  });
});
