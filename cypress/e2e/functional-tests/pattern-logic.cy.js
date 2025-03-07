/*
  This test case opens the pattern page. It then creates a new pattern. It adds one point and changes the xoffset value.
  After this the test checks if the points element is disabled. It then clicks the dangerous elements button and checks if the points element is enabled.
  It ends the test by closing the pattern without saving.
*/
describe("Open pattern page", () => {
  it("loads successfully", () => {
    cy.login();
    cy.visit("http://localhost:3000/pattern-editor");
    cy.get("#root", {
      timeout: 5000,
    }).should("be.visible");

    cy.wait(50);
    cy.get("#pattern-speeddial").click({ force: true });

    cy.wait(50);
    cy.get('[aria-label="Create a new pattern"]').click({ force: true });

    cy.wait(50);
    cy.get("#simple-tab-1").click({ force: true });

    cy.wait(50);
    cy.get('[aria-label="Add point"]').click({ force: true });

    cy.wait(50);
    cy.get("li").should("exist");

    cy.wait(50);
    cy.get("#simple-tab-0").click({ force: true });

    cy.wait(50);
    cy.get("#svg-xoffset-input").clear().type("100");

    cy.wait(50);
    cy.get("#svg-points").should("have.css", "pointer-events", "none");

    cy.wait(50);
    cy.get("#svg-toggle-dangerous-elements").click({ force: true });

    cy.wait(50);
    cy.get("#svg-points").should("not.be.disabled");

    cy.wait(50);
    cy.get('[aria-label="SpeedDial basic example"]').click({ force: true });

    cy.wait(50);
    cy.get('[aria-label="Clear editor field"]').click({ force: true });
  });
});
