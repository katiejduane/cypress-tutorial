
describe('List items', () => {
    beforeEach(() => {
        cy.seedAndVisit()
    })

    it('properly diplays completed items', () => {
        cy.get('.todo-list li')
            .filter('.completed')
            .should('have.length', 1)
            .and('contain', 'Eggs')
            .find('.toggle')
            .should('be.checked')
    })

    it('Shows remaining todos in the footer', () => {
        cy.get('.todo-count')
        .should('contain', 3)
    })

    it('Removes a todo', () => {
        cy.route({
            url: '/api/todos/1',
            method: 'DELETE',
            status: 200,
            response: {}
        })

        cy.get('.todo-list li')
            .as('list')
            //creates an alias

        cy.get('@list')
        //uses alias
            .first()
            .find('.destroy')
            .invoke('show')
            // forces the item to be shown, even tho in this case its CSS display property is set to none
            .click()

        cy.get('@list')
            .should('have.length', 3)
            .and('not.contain', 'Milk')
    }) 
    
    it.only('Marks and incomplete item complete', () => {
        cy.fixture('todos')
        .then(todos => {
            const target = Cypress._.head(todos)
            cy.route(
                'PUT',
                `/api/todos/${target.id}`,
                Cypress._.merge(target, {isComplete: true})
            )
        })
        cy.get('.todo-list li')
            .first()
            .as('first-todo')

        cy.get('@first-todo')
            .find('.toggle')
            .click()
            .should('be.checked')
        
        cy.get('@first-todo')
            .should('have.class', 'completed')

        cy.get('.todo-count')
            .should('contain', 2)
    })  
})