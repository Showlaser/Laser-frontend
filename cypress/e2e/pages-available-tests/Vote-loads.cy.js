describe("Open vote page", () => {
  it("loads successfully", () => {
    cy.visit("http://localhost:3000/vote");
  });
});
