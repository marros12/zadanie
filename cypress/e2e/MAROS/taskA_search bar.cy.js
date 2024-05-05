describe('Search bar', function() {
  
    beforeEach(() => {
        cy.viewport(1920, 937)
        cy.visit('https://docs.cypress.io/.')

    })

    
    it('Inputs correct data, querries results and opens matching result', function() {
        //opens search bar
        cy.get('.icon-light-transparent').click()
        //checks that search history is clear
        cy.get('.DocSearch-Help').contains('No recent searches').should('be.visible')
        
        //inputs data that is supposed to be querried
        cy.get('.DocSearch-Input').type('Test Replay')
        cy.wait(1000)
        //checks for the exact match 
        cy.get('.DocSearch-Hit').first()
        .should('have.attr', 'aria-selected', 'true')
        .should('contain', 'Test Replay')
        .as('resultHit')

        //checks for the sub categories about this topic
        cy.get('.DocSearch-Hit').each(($el, index) => {
            if (index !== 0) {
                cy.wrap($el).invoke('text').then(text => {
                    expect(text.toLowerCase()).to.include('test replay');
                });
                cy.wrap($el).should('have.attr', 'aria-selected', 'false');
            }
        });
        

        //clicks on matching result and checks whether the correct page loads up
        cy.get('@resultHit').click().then(() => {
            cy.url({ timeout: 5000 }).should('eq', 'https://docs.cypress.io/guides/cloud/test-replay#__docusaurus_skipToContent_fallback');
          });
    
        cy.get('.headerWrapper_tu51').should('contain', 'Test Replay')
        

        //imputs half correct data to see whether search bar can querry it correctly
        cy.get('.icon-light-transparent').click()
        cy.get('.DocSearch-Input').type('GitHib')
        cy.wait(1000)
        //checks for the exact match 
        cy.get('.DocSearch-Hit').first()
        .should('have.attr', 'aria-selected', 'true')
        .should('contain', 'GitHub')
        .as('resultHit')

        //checks for the sub categories about this topic
        cy.get('.DocSearch-Hit').each(($el, index) => {
            if (index !== 0) {
                cy.wrap($el).invoke('text').then(text => {
                    expect(text.toLowerCase()).to.include('github');
                });
                cy.wrap($el).should('have.attr', 'aria-selected', 'false');
            }
        });
                
        //try to use keyboard commands
        //downarrow
        for (let i = 0; i < 3; i++) {
            cy.get('input[type="search"]').type('{downarrow}');
            
            //checks whether right search result is highlighted
            cy.get('.DocSearch-Hit').each(($el, index) => {
                if (index === i + 1) {
                    cy.wrap($el).should('have.attr', 'aria-selected', 'true');
                } else {
                    cy.wrap($el).should('have.attr', 'aria-selected', 'false');
                }
            });
        }

        //uparrow
        for (let x = 3; x >= 1; x--) { 
            cy.get('input[type="search"]').type('{uparrow}');
            
            // checks whether the right search result is highlighted
            cy.get('.DocSearch-Hit').each(($el, index) => {
                if (index === x - 1) {
                    cy.wrap($el).should('have.attr', 'aria-selected', 'true');
                } else {
                    cy.wrap($el).should('have.attr', 'aria-selected', 'false');
                }
            });
        }

        //enter
        cy.get('input[type="search"]').type('{enter}')
        cy.get('.headerWrapper_tu51').should('contain', 'GitHub Integration').should('be.visible')

        //esc
        cy.get('.icon-light-transparent').click()
        cy.get('input[type="search"]').type('{esc}');
        cy.get('.headerWrapper_tu51').should('contain', 'GitHub Integration').should('be.visible')

        
        //checks whether last opened item is on top of the recent history list
        //checks for recent history and tries to open item from recent history
        cy.get('.icon-light-transparent').click()
        cy.get('.DocSearch-Hit').eq(0).should('contain', 'GitHub Integration')
        cy.get('.DocSearch-Hit').eq(1).should('contain', 'Test Replay').click()
               
        //ads item to favorite
        cy.get('.icon-light-transparent').click()
        cy.get('[title="Save this search"]').first().click()
        cy.get('.DocSearch-Hit-source').contains('Favorite').should('be.visible').as('favoriteList')
        cy.get('@favoriteList').next().find('.DocSearch-Hit')
        .should('contain', 'Test Replay')
        .should('be.visible')

        
        //ads another favorite and checks for order
        cy.get('[title="Save this search"]').click()
        cy.wait(1000)
        cy.get('.DocSearch-Hit-source').contains('Favorite').should('be.visible').as('favoriteList')
        cy.get('@favoriteList').next().find('.DocSearch-Hit')
        .should('contain', 'GitHub Integration')
        .should('be.visible')

        //deletes item from favorites
        cy.get('[title="Remove this search from favorites"]').first().click()
        cy.get('.DocSearch-Hit').should('have.length', 1).and('contain', 'Test Replay');

        //see all the results option
        cy.get('.DocSearch-Input').type('Cypress')
        cy.wait(1000)
        cy.get('.DocSearch-HitsFooter').find('a[href]').first().click()

        //checks whether results are matching and whether the matching part is highlighted in different background color
        cy.get('.searchResultItemHeading_KbCB').each(($element) => {
            cy.wrap($element).find('span')
            .should('have.class', 'search-result-match')
            .and('have.css', 'background-color', 'rgba(255, 215, 142, 0.25)')
          })
          
        //tries to open item from see all list
        cy.get('.searchResultItemHeading_KbCB').find('a[href]').first().click()
        cy.get('.headerWrapper_tu51').should('contain', 'Cypress.Cookies')

       

        //deletes item from recent history
        cy.get('.icon-light-transparent').click()
        cy.get('.DocSearch-Input').type('Login')
        cy.wait(1000)
        cy.get('.DocSearch-Hit').first().click()
        
        cy.get('.icon-light-transparent').click()
        cy.get('[title="Remove this search from history"]').first().click()
        cy.get('.DocSearch-Hit').should('have.length', 1).and('contain', 'Test Replay');

        //inputs incorrect data and checks for no result message
        cy.get('.DocSearch-Input').type('999999999999')
        cy.wait(1000)
        cy.get('.DocSearch-NoResults-Prefill-List').should('be.visible')
        cy.get('.DocSearch-Prefill').should('be.visible')
        

        //tries to open Prefill link 
        cy.get('.DocSearch-Prefill').should('be.visible').first().then(($element) => {
            //invoke the text of the element
            const text = $element.text().trim();
            
            //click on the element
            cy.wrap($element).click({ force: true }).then(() => {
                cy.get('.DocSearch-Input').then(($inputs) => {
                    //get the input
                    const $input = $inputs.first() 
        
                    //checks that the input contains the clicked item's text
                    const inputTextTrimmed = $input.val().trim().toLowerCase();
                    const searchTextTrimmed = text.toLowerCase();
                    expect(inputTextTrimmed).to.include(searchTextTrimmed);

                    //checks whether correct section is querried
                    cy.get('.DocSearch-Hit-source').contains('Guides').should('be.visible')

                    
                });
            });
        });
        
        //tries to use  delete 'x' icon in input field
        cy.get('.DocSearch-Reset').click()
        cy.get('.DocSearch-Input').should('have.value', '');


        
        
        //checks external algiola link 
        cy.get('.DocSearch-Logo').find('a').invoke('removeAttr','target').click();
        /*
        Vercel Security Checkpoint - i had to add timeout for it to pass just to get 
        Application error: a client-side exception has occurred (see the browser console for more information).
        403 (Forbidden)
        cy.get('h1:contains("Algolia Developer Hub")', { timeout: 10000 })
        */ 
        
        
        
    }); 

})  


