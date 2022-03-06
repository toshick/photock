describe('top', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitPageIdle();
  });

  it('should render album list', () => {
    cy.get('html')
      .containsChain('アルバム一覧')
      .containsChain('0000-0000-e2e')
      .find('.albumlist li')
      .should('have.lengthOf.gte', 9);
  });
  it('should create an album', () => {
    cy.contains('新規アルバム').closest('.dropdown-trigger').click();
    cy.get('html')
      .containsChain('アルバム作成')
      .should('be.visible')
      .containsChain('必須だケロ')
      .should('be.visible')
      .get('input[placeholder="アルバムID（30文字以下）"]')
      .type('hogeeee');
    cy.contains('追加').click();
    cy.contains('アルバム作成').should('not.be.visible');
    cy.get('.albumlist li:first-child .album-id')
      .contains('hogeeee')
      .should('be.visible');
  });
  it('should delete an album', () => {
    cy.get('.albumlist li:first-child .album-id')
      .contains('hogeeee')
      .closest('.album-link')
      .click();
    // ページ移動
    cy.url().should('include', '/albums/hogeeee/');
    cy.get('html');
    cy.contains('NO ITEMS');
    cy.get('input[placeholder="アルバムID"]').should('have.value', 'hogeeee');
    // アルバム削除
    cy.contains('アルバム削除').click();
    cy.contains('このアルバムを削除してトップへ戻ります');
    cy.contains('アルバム "hogeeee" を削除').should('be.visible').click();
    // ページ移動
    cy.contains('アルバム一覧');
    cy.contains('アルバム hogeeee を削除したケロ');
    cy.get('.albumlist li:first-child .album-id')
      .contains('hogeeee')
      .should('not.exist');
  });
});
