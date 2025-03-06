describe("Open spotify connector page", () => {
  it("loads successfully", () => {
    cy.login();
    cy.visit("http://localhost:3000/lasershow-spotify-connector");
  });
});
