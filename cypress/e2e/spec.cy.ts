describe('My First Test', () => {
  it('Visits the home page and clicks the about page', () => {
    cy.visit('http://localhost:4200');
    cy.contains('About').click();

    cy.url().should('include', '/about');
  });
});

describe('Login', () => {
  it('Visits the home page and logs in', () => {
    cy.visit('http://localhost:4200');
    cy.contains('Login').click();

    cy.url().should('include', '/login');
    cy.get('input[name="username"]').type('exampleuser');
    cy.get('input[name="password"]').type('examplepassword');
    cy.get('.mdc-button__label').contains('Log In').click();
  });
});
