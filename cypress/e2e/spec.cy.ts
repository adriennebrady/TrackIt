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

// S I G N  U P
// Test: Username already exists
// Test: Confirm password not correct

/*
describe('Register User', () => {
  it('Register valid user', function() {
    cy.visit('/')
    cy.contains('Sign Up').click()

    cy.url().should('include', '/signup')
    cy.get('mat-label.ng-tns-c79-0').type('test1')
    cy.get('mat-label.ng-tns-c79-1').type('testing')
    cy.get('mat-label.ng-tns-c79-2').type('testing')

    cy.get('form.ng-dirty > .mdc-button > .mdc-button__label').click()

    // User should be redirected to /inventory
    cy.url().should('include', '/inventory')
  
    // Page should display user inventory
    cy.get('h1').should('contain', "Your Inventory")
  })
})
*/

describe('Valid User Navigation', () => {
  beforeEach(function () {
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

  it('User navigates from My Inventory page to About page then back', () => {
    cy.contains('About').click()
    cy.url().should('include', '/about')

    cy.contains('My Inventory').click()
    cy.url().should('include', '/inventory')
  })

  it('User sign out', () => {
    cy.contains('Sign Out').click()
    cy.url().should('include', '/home')
  })

  // Create new container
  it('User clicks Create Container', () => {
    cy.contains('Create new container').click()
    cy.get('app-dialog.ng-star-inserted')
    .should('be.visible').should('contain', 'Add Container')
    .then(($dialog)=>{
      cy.wrap($dialog).get('.nameField').type('Test Container');
      cy.wrap($dialog).get('.descriptionField').type('Hello World');
      cy.wrap($dialog).find('button').contains('Save').click();
    });
  })
})