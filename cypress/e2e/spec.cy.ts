describe('Visit TrackIt Home Page', () => {
  it('Visits the TrackIt home page', () => {
    cy.visit('/')
  })
})

describe('Visit About Page from Home Page', () => {
  it('Visits the home page and clicks the about page', () => {
    cy.visit('/')
    cy.contains('About').click()

    cy.url().should('include', '/about')
  })
})

describe('Visit Login Page from Home Page', () => {
  it('Visits the home page and clicks the login page', () => {
    cy.visit('/')
    cy.contains('Login').click()

    cy.url().should('include', '/login')
  })
})

describe('Visit Signup Page from Home Page', () => {
  it('Visits the home page and clicks the sign up page', () => {
    cy.visit('/')
    cy.contains('Sign Up').click()

    cy.url().should('include', '/signup')
  })
})

// S I G N  U P
// Test: Username already exists
// Test: Confirm password not correct

// L O G I N
// Test: Incorrect uesrname
// Test: Incorrect password

describe('Login Authentication', () => {
  it('Correct username and password', () => {
    cy.visit('http://localhost:4200/')
    cy.contains('Login').click()

    // Enter username
    cy.get('#mat-input-0').type('test1')

    // Enter password
    cy.get('#mat-input-1').type('testing')

    // Click Login button
    cy.get('form.ng-dirty > .mdc-button > .mdc-button__label').click()

    // User should be redirected to /inventory
    cy.url().should('include', '/inventory')
  
    // Page should display user inventory
    cy.get('h1').should('contain', "Your Inventory")
  })
})