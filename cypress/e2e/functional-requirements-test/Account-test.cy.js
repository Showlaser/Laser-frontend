describe("Edit account test", () => {
  it("Logs the user in, edits the account and resets the data", () => {
    Cypress.Cookies.defaults({ preserve: "jwt" });

    const username = "TestUser";
    const newUsername = "TestUser2";
    const password = "qwerty";

    cy.visit("http://localhost:3000/login");
    cy.get("input[name=username]").clear().type(username);
    cy.get("input[name=password]").clear().type(`${password}{enter}`);
    cy.get("#root", {
      timeout: 5000,
    }).should("be.visible");

    cy.visit("http://localhost:3000/account");
    cy.get("input[name=username]").should("have.value", username);

    cy.get("input[name=username]").clear().type(newUsername);
    cy.get("input[name=password]").clear().type(`${password}{enter}`);
    cy.get("#root", {
      timeout: 5000,
    }).contains("Changes saved");

    cy.get("input[name=username]").should("have.value", newUsername);
    cy.get("input[name=username]").clear().type(username);
    cy.get("input[name=password]").clear().type(`${password}{enter}`);
    cy.get("#root", {
      timeout: 5000,
    }).contains("Changes saved");
  });
});
