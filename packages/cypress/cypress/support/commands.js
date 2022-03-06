// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import 'cypress-wait-until';

//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add(
  'containsChain',
  { prevSubject: 'element' },
  (subject, value) => {
    cy.get(subject).contains(value);
    cy.get(subject).then(() => {
      return subject;
    });
  }
);

Cypress.Commands.add('waitPageIdle', () => {
  cy.waitUntil(() =>
    cy.window().then((win) => {
      // return Boolean(win.$nuxt.config.globalProperties.$oruga);
      return new Promise((resolve) => {
        win.requestIdleCallback(() => {
          setTimeout(() => {
            resolve();
          }, 300);
        });
      });
    })
  );
});

Cypress.Commands.overwrite('log', (subject, message) =>
  cy.task('log', message)
);
