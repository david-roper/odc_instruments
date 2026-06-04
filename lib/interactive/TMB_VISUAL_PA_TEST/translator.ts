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
        en: 'TMB Visual Paired Associates Memory - Test',
        fr: 'Mémoire des paires associées visuelles — Test'
      },
      instructionsHeading: {
        en: 'Instructions:',
        fr: 'Instructions :'
      },
      testYourMemory: {
        en: "Let's test your memory for the images<br>you learned a few minutes ago.",
        fr: 'Testons votre mémoire des images<br>que vous avez apprises il y a quelques minutes.'
      },
      forPractice: {
        en: 'For practice, click the image<br>that goes together with this.',
        fr: 'Pour vous entraîner, cliquez sur l’image<br>qui va avec celle-ci.'
      },
      hintBridge: {
        en: "(hint: it's a bridge!)",
        fr: '(indice : c’est un pont !)'
      },
      excellent: {
        en: 'Excellent!',
        fr: 'Excellent !'
      },
      recallAll: {
        en: 'You will be asked to recall all {count} pairs.',
        fr: 'On vous demandera de vous rappeler les {count} paires.'
      },
      letsStart: {
        en: "Let's start!",
        fr: 'Commençons !'
      }
    },
    feedback: {
      pairYouLearned: {
        en: 'The image pair you learned was:',
        fr: 'La paire d’images que vous avez apprise était :'
      },
      clickRight: {
        en: 'You should click the image on the right.',
        fr: 'Vous devez cliquer sur l’image de droite.'
      },
      takingTooLong: {
        en: 'You are taking too long to respond.',
        fr: 'Vous mettez trop de temps à répondre.'
      },
      clickGoesWith: {
        en: 'You should click the image that goes with this:',
        fr: 'Vous devez cliquer sur l’image qui va avec celle-ci :'
      }
    }
  }
});
