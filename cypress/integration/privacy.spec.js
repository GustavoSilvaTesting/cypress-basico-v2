it('Teste', function() {
    cy.visit('./src/privacy.html')
    cy.contains('Talking About').should('be.visible')
})