/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
  
   // Visitando pasta local com arquivo relativo através do visit antes de cada teste(beforeEach)    
   beforeEach( function() {
    cy.visit('./src/index.html')
  })
  
  it('Verifica o título da aplicação', function() {
    cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
  })

  it('Preenche os campos obrigatórios e envia o Form', function() {    
    const longText = 'Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste'
    cy.get('#firstName').type('Gustavo ')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('Email@teste.com')
    // o Delay(objeto Options) sobrescreve o default e torna mais rápido a escrita do teste no campo
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.contains('button', 'Enviar').click()
    //elemento pego atraves da classe: .success;
    cy.get('.success').should('be.visible').contains('Mensagem enviada com sucesso')
  })

  it('Exibe mensagem de erro ao submeter e-mail inválido', function() {    
    cy.get('#firstName').type('Gustavo ')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('EmailFailed')
    cy.get('#open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()
    //pegando o elemento através da classe .error
    cy.get('.error').should('be.visible').contains('Valide os campos obrigatórios!')
  })

  it('Campo telefone continua vazio quando preenchido com valor não-numérico', function() {    
    cy.get('#phone')
      .type('assdasdfg')
      .should('have.value', '')
      // usando o have.value para confirmar que o campo esta vazio
  })

  it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido', function() {    
    cy.get('#firstName').type('Gustavo ')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('gustavo@email.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()
    //pegando o elemento através da classe .error
    cy.get('.error').should('be.visible').contains('Valide os campos obrigatórios!')
  })

  it('Preenche e limpa os campos', function() {    
    cy.get('#firstName')
      .type('Gustavo ')
      .should('have.value', 'Gustavo ')
      .clear()
    cy.get('#lastName')
      .type('Silva')
      .should('have.value', 'Silva')
      .clear()
    cy.get('#email')
      .type('gustavo@email.com')
      .should('have.value', 'gustavo@email.com')
      .clear()
    cy.get('#open-text-area')
      .type('Teste obs')
      .should('have.value', 'Teste obs')
      .clear()
  })

  it('Exibe mensagem de erro ao submeter o form sem preencher os campos obrigatórios', function() {    
    cy.get('button[type="submit"]').click()
    //pegando o elemento através da classe .error
    cy.get('.error').should('be.visible').contains('Valide os campos obrigatórios!')
  })

  it('Envia o form com sucesso utilizando um comando customizado', function() {    
    cy.fillMandatoryFieldsAndSubmit()
  })

  it('Seleciona um produto Youtube pelo texto', function() {    
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')      
  })  

  it('Seleciona um produto Youtube pelo value', function() {    
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')      
  }) 

  it('Seleciona um produto Youtube pelo índice', function() {    
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')      
  })

  it('Marcar o tipo de atendimento Feedback', function() {   
    //elemento identificado atraves do type e do value 
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('have.value', 'feedback') // checando pelo value  
      .should('be.checked') //checando se esta marcado      
  })

  it('Marcar cada tipo de atendimento', function() {   
    cy.get('input[type="radio"]')
      .should('have.length', 3) //verificando a quantidade de elementos    
      .each(function ($radio) {
          cy.wrap($radio).check() 
          cy.wrap($radio).should('be.checked') 
          // função que passa por cada elemento e checa se esta marcado
      })      
  })

  it('Marcar ambos os checkbox e desmarca o ultimo', function() {   
    cy.get('input[type="checkbox"]') // no caso dos checkbox, se o seletor for mais generico, se tiver mais de um elemento, ele marca todos. ajudando na checagem, para que nao precise selecionar um de cada vez
      .check()
      .should('be.checked')
      .last() // seleciona o ultimo elemento
      .uncheck() // desmarca o ultimo elemento selecionado
      .should('not.be.checked')            
  })

  it('Seleciona um arquivo da pasta fixtures', function() {  
    //Selecionando elemento misturando tipo e identificado 
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
      .should(function($input){
        expect($input[0].files[0].name).to.equal('example.json')
        // Nesse trecho ele cria um registro la no console, um objeto jquery, onde conseguimos checar os dados atraves das propriedades dos objetos. Aqui verificamos o nome atraves do files.
      })
  })

  it('Seleciona um arquivo simulando um drag-and-drop', function() {  
    //Selecionando elemento misturando tipo e identificado 
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', { action: "drag-drop"}) // o action simula a usuario arrastando o arquivo para anexar. 
      .should(function($input){
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })

  it('Teste Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {  
    cy.fixture('example.json').as('sampleFile')
    cy.get('input[type="file"]')
      .selectFile('@sampleFile')
      .should(function($input){
        expect($input[0].files[0].name).to.equal('example.json')
      })      
  })

  it('Verifica a politica de privacidade', function() {  
    cy.get('#privacy a').should('have.attr', 'target', '_blank') // Verificar se tem o atributo que faz abrir a pagina em outra aba      
  })

  it('Acessa a pagina de politica de privacidade removendo a funcao target', function() {  
    cy.get('#privacy a')
    .invoke('removeAttr', 'target')
    .click()
    cy.contains('Talking About').should('be.visible')
  })


})