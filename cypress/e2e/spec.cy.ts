describe('My First Test', () => {
  it('Visits the home page and clicks the about page', () => {
    cy.visit('http://localhost:4200')
    cy.contains('About').click()

    cy.url().should('include', '/about')
  })
})