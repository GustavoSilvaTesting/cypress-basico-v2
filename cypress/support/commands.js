Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
  cy.get('#firstName').type('Gustavo ')
  cy.get('#lastName').type('Silva')
  cy.get('#email').type('Email@teste.com')  
  cy.get('#open-text-area').type('Teste campo obs.')
  cy.get('button[type="submit"]').click()
  cy.get('.success').should('be.visible').contains('Mensagem enviada com sucesso')
})