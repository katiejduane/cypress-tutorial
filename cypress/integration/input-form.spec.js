import { isContext } from "vm";

describe('Input form', () => {
    beforeEach(()=> {
        cy.visit('/')
    })
    it('focuses input on load', () => {

        cy.focused()
        .should('have.class', 'new-todo')
    })

    it('accepts input', () => {
        const typed = 'Buy Milk'

        cy.get('.new-todo')
        .type(typed)
        .should('have.value', typed)
    })
    
    context('Form Submission', () => {
        beforeEach(() => {
            cy.server()
        })
        it('Adds a new todo on submit', () => {
            const itemText = 'Buy eggs'
            cy.route('POST', '/api/todos', {
                name: itemText,
                id: 1,
                isComplete: false
            })
            cy.get('.new-todo')
                .type(itemText)
                .type('{enter}')
                .should('have.value', '')

            // in curly brackets, a key press is denoted
            cy.get('.todo-list li')
                .should('have.length', 1)
                .and('contain', itemText)
                // and is like should but makes the test read more like a sentence
        })

        it('Shows an error message on a dailed submission', () => {
            cy.route({
                url: '/api/todos',
                method: 'POST',
                status: 500,
                response: {}
            })

            cy.get('.new-todo')
                .type('test{enter}')

            cy.get('.todo-list li')
                .should('not.exist')
            
            cy.get('.error')
                .should('be.visible')
        })
    });
})

