// In cypress/support/commands.js

Cypress.Commands.add("login", () => {
  const username = "vincent";

  cy.session(
    username,
    () => {
      const password = "123";

      cy.visit("http://localhost:3000/login");
      cy.get("input[name=username]").clear().type(username);
      cy.get("input[name=password]").clear().type(`${password}{enter}`, { log: false });
      cy.get("#root", {
        timeout: 5000,
      }).should("be.visible");

      cy.url().should("include", "http://localhost:3000/disclaimer");
    },
    {
      validate: () => {
        cy.getCookie("jwt").should("exist");
      },
    }
  );
});
