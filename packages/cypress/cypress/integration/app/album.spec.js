describe('detail', () => {
  beforeEach(() => {
    cy.visit('/albums/0000-0000-e2e/');
    cy.waitPageIdle();
  });

  it('should render album list', () => {
    cy.get('html')
      .containsChain('アルバムID')
      .containsChain('アルバムタイトル')
      .containsChain('アルバム説明')
      .containsChain('アルバムまとめ');
    cy.get('.imglist li').should('have.length', 3);
  });
  it('should save album info', () => {
    const rnd = new Date().getTime();
    const title = `title-${rnd}`;
    const des = `des-${rnd}`;
    const conclution = `conclution-${rnd}`;

    waitForDataLoad();

    cy.get('input[placeholder="アルバムタイトル"]')
      .type(`{selectAll}${title}`)
      .closest('.myform')
      .find('a')
      .click();
    cy.waitPageIdle();
    cy.contains('アルバムタイトル')
      .closest('.myform')
      .find('button')
      .should('have.attr', 'disabled');

    cy.get('textarea[placeholder="アルバム説明"]')
      .type(`{selectAll}${des}`)
      .closest('.albumDescription')
      .contains('保存')
      .closest('a')
      .click();
    cy.waitPageIdle();
    cy.contains('アルバム説明')
      .closest('.albumDescription')
      .find('button')
      .should('have.attr', 'disabled');

    cy.get('textarea[placeholder="アルバムまとめ"]')
      .type(`{selectAll}${conclution}`)
      .closest('.albumConclusion')
      .contains('保存')
      .closest('a')
      .click();
    cy.waitPageIdle();
    cy.contains('アルバムまとめ')
      .closest('.albumConclusion')
      .find('button')
      .should('have.attr', 'disabled');

    // cy.reload();
    // cy.waitPageIdle();
    // cy.get('input[placeholder="アルバムタイトル"]').should('have.value', title);
    // cy.get('textarea[placeholder="アルバム説明"]').should('have.value', des);
    // cy.get('textarea[placeholder="アルバムまとめ"]').should(
    //   'have.value',
    //   conclution
    // );
  });
  it('should save album item info', () => {
    const rnd = new Date().getTime();
    const itemTitle = `itemTitle-${rnd}`;
    const itemDes = `itemDes-${rnd}`;

    cy.get('.imglist-item:first-child').within(($el) => {
      cy.wrap($el).find('.btn-save').should('not.exist');
      cy.wrap($el).find('input[type="text"]').type(`{selectAll}${itemTitle}`);
      cy.wrap($el).find('textarea').type(`{selectAll}${itemDes}`);
      cy.wrap($el).find('.btn-save').click();
      cy.waitPageIdle();
      cy.wrap($el).containsChain('Saved').find('.btn-save').should('not.exist');
    });
  });
  it('should work check all', () => {
    waitForDataLoad();
    cy.get('.imglist-item input[type="checkbox"]').should('not.be.checked');
    cy.contains('Check All').click();
    cy.get('.imglist-item input[type="checkbox"]').should('be.checked');
    // header menu
    cy.contains('選択解除').click();
    cy.get('.imglist-item input[type="checkbox"]').should('not.be.checked');
  });
  it('should work export', () => {
    waitForDataLoad();
    cy.contains('エクスポート').click();
    cy.contains('エクスポートを完了').should('be.exist');
  });
});

function waitForDataLoad() {
  cy.waitUntil(() => {
    return cy
      .get('input[placeholder="アルバムID"]')
      .should('have.value', '0000-0000-e2e');
  });
}
