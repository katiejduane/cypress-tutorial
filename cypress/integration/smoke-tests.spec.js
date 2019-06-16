// tests with the API stubbed out (or stubbed networkd reqs; allowing us to test the front end
// without needing the backend connected) are relatively lightweight, flexible, and they allow us 
// to test scenarios that are difficult to set up, such as error conditions from the server. 
// Integration tests like these should make up the majority of our test. We should, however, once 
// the backend IS connected, have a few full end-to-end tests to make sure our application works 
// through each layer. Since these tests interact with more components and can be trickier to set up,
// this tutorial will keep them a minimum!

// we will have tests for each request type (get, post, put) ====>

describe('Smoke tests', () => {
    beforeEach(() => {
        cy.request('GET', '/api/todos')
            .its('body')
            .each(todo => cy.request('DELETE', `/api/todos/${todo.id}`))
    })

    context('With no todos', () => {
        it('Saves new todos', () => {
            const items = [
                { text: 'Buy rocks', expectedLength: 1 },
                { text: 'Grind rocks', expectedLength: 2 },
                { text: 'Make sandcastle', expectedLength: 3 },
            ]
            cy.visit('/')
            cy.server()
            cy.route('POST', '/api/todos')
                .as('create')

            cy.wrap(items)
                .each(todo => {
                    cy.focused()
                        .type(todo.text)
                        .type('{enter}')

                    cy.wait('@create')
                    //this tells cypress to wait for the post req above to complete before finishing the test
                    //so that the test does not fail simply because the backend took a bit too long to respond
                    //as these wait times are usually out of our control!
            
                    cy.get('.todo-list li')
                        .should('have.length', todo.expectedLength)
            })
        })
    })

    context('With active todos', () => {
        beforeEach(() => {
            cy.fixture('todos')
                .each(todo => {
                    const newTodo = Cypress._.merge(todo, {isComplete: false})
                    cy.request('POST', '/api/todos', newTodo)
                })
                cy.visit('/')
            })

        it('Loads existing data from the DB', () => {
            cy.get('.todo-list li')
                .should('have.length', 4)
        })

        it('Deletes todos', () => {
            cy.server()
            cy.route('DELETE', '/api/todos/*')
                .as('delete')

            cy.get('.todo-list li')
                .each($el => {
                    cy.wrap($el)
                        .find('.destroy')
                        .invoke('show')
                        .click()
                    
                    cy.wait('@delete')
                })
                .should('not.exist')
        })

        it('Toggles todos', () => {
            const clickAndWait = ($el) => {
                cy.wrap($el)
                    .as('item')
                    .find('.toggle')
                    .click()
                cy.wait('@update')
            }
            cy.server()
            cy.route('PUT', '/api/todos/*')
                .as('update')

            cy.get('.todo-list li')
                .each($el => {
                    clickAndWait($el)

                    cy.get('@item')
                        .should('have.class', 'completed')
                })
                .each($el => {
                    clickAndWait($el)

                    cy.get('@item')
                        .should('not.have.class', 'completed')
                })
        })
    })
})

