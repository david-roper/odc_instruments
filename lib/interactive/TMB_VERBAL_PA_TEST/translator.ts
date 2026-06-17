import { Translator } from '/runtime/v1/@opendatacapture/runtime-core';

export const translator = new Translator({
  translations: {
    buttons: {
      clickContinue: {
        en: 'Click here to continue',
        fr: 'Cliquez ici pour continuer'
      },
      clickInstructions: {
        en: 'Click here for instructions',
        fr: 'Cliquez ici pour les instructions'
      },
      clickRetry: {
        en: 'Click here to retry',
        fr: 'Cliquez ici pour réessayer'
      }
    },
    counter: {
      of: {
        en: 'of',
        fr: 'sur'
      },
      practice: {
        en: 'Practice',
        fr: 'Entraînement'
      }
    },
    test: {
      beginTitle: {
        en: 'Remembering Words',
        fr: 'Se souvenir des mots'
      },
      examplePair: {
        en: 'SKY - GREEN',
        fr: 'CIEL - VERT'
      },
      instructionsHeading: {
        en: 'Instructions:',
        fr: 'Instructions :'
      },
      testYourMemory: {
        en: "Let's test your memory for the words<br>you learned a few minutes ago.",
        fr: 'Testons votre mémoire des mots<br>que vous avez appris il y a quelques minutes.'
      },
      forPractice: {
        en: 'For practice, click the word<br>that goes together with SKY.',
        fr: 'Pour vous entraîner, cliquez sur le mot<br>qui va avec CIEL.'
      },
      hintGreen: {
        en: "(hint: it's GREEN!)",
        fr: '(indice : c’est VERT !)'
      },
      excellent: {
        en: 'Excellent!',
        fr: 'Excellent !'
      },
      recallAll: {
        en: 'You will be asked to recall all {count} pairs<br>of words you saw previously.',
        fr: 'On vous demandera de vous rappeler les {count} paires<br>de mots vues précédemment.'
      },
      letsStart: {
        en: "Let's start!",
        fr: 'Commençons !'
      }
    },
    feedback: {
      pairYouLearned: {
        en: 'The word pair you learned was:',
        fr: 'La paire de mots que vous avez apprise était :'
      },
      clickTarget: {
        en: "You should click '<b>{target}</b>'.",
        fr: 'Vous devez cliquer sur « <b>{target}</b> ».'
      },
      takingTooLong: {
        en: 'You are taking too long to respond.',
        fr: 'Vous mettez trop de temps à répondre.'
      },
      clickGoesWith: {
        en: "You should click the word<br>that goes with '<b>{probe}</b>'.",
        fr: 'Vous devez cliquer sur le mot<br>qui va avec « <b>{probe}</b> ».'
      }
    }
  }
});
