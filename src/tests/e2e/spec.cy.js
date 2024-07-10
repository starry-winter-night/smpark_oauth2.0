describe('OAuth Login Flow', () => {
  it('OAuth 로그인', () => {
    cy.visit('http://localhost:3000');
    cy.get('.menu_auth__Xfa85').click();
    cy.get('.login_loginButtons__uaWvG > :nth-child(3)').click();
    cy.get('#oauthInputId').type('tester');
    cy.get('#oauthInputPassword').type('1234');
    cy.get('#oauthLoginButton').click();
    cy.get('.agreeButton').click();
  });
});
