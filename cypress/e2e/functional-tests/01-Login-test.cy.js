describe("Login test", () => {
  it("Logs the user in", () => {
    const username = "vincent";
    const password = "123";

    cy.visit("http://localhost:3000/login");
    cy.get("input[name=username]").clear().type(username);
    cy.get("input[name=password]").clear().type(`${password}{enter}`, { log: false });
    cy.get("#root", {
      timeout: 5000,
    }).should("be.visible");

    // we should be redirected to /dashboard
    cy.url().should("include", "http://localhost:3000/disclaimer");
    cy.getCookie("jwt").should("exist");
  });
});
