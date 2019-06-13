// sample passing test
describe('My First Test', function(){
    it('Does not do much!', function(){
        expect(true).to.equal(true)
    })
})

// sample failing test
describe('My Second Test', function(){
    it('Does not do much', function(){
        expect(true).to.equal(false)
    })
})

// an actual test using cypress's sample kitchen sink application
describe('My Third Test', function(){
    it('Visits the Kitchen Sink', function(){
        cy.visit('https://example.cypress.io')
    })
})

// query an element in the dom
describe('My Fourth Test', function () {
    it('finds the content "type"', function () {
        cy.visit('https://example.cypress.io')

        cy.contains('type')
    })
})

// click an element {test shows what should be revealed if said element is clicked}
describe('My Fifth Test', function () {
    it('clicks the link "type"', function () {
        cy.visit('https://example.cypress.io')

        cy.contains('type').click()
    })
})

// make an assertion about something on the page
describe('My Sixth Test', function () {
    it('clicking "type" navigates to a new url', function () {
        cy.visit('https://example.cypress.io')

        cy.contains('type').click()

        // Should be on a new URL which includes '/commands/actions'
        cy.url().should('include', '/commands/actions')
    })
})

// adding more commands and assertions
describe('My Seventh Test', function () {
    it('Gets, types and asserts', function () {
        cy.visit('https://example.cypress.io')

        cy.contains('type').click()

        // Should be on a new URL which includes '/commands/actions'
        cy.url().should('include', '/commands/actions')

        // Get an input, type into it and verify that the value has been updated
        cy.get('.action-email')
            .type('fake@email.com')
            .should('have.value', 'fake@email.com')
    })
})