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
      },
      spaceContinue: {
        en: 'Press the SPACEBAR to continue',
        fr: "Appuyez sur la BARRE D'ESPACE pour continuer"
      },
      spaceInstructions: {
        en: 'Press the SPACEBAR for instructions',
        fr: "Appuyez sur la BARRE D'ESPACE pour les instructions"
      },
      spaceRetry: {
        en: 'Press the SPACEBAR to retry',
        fr: "Appuyez sur la BARRE D'ESPACE pour réessayer"
      }
    },
    feedback: {
      middleRight: {
        en: 'The arrow in the middle was pointing <b>right</b>:',
        fr: 'La flèche du milieu pointait vers la <b>droite</b> :'
      },
      middleLeft: {
        en: 'The arrow in the middle was pointing <b>left</b>:',
        fr: 'La flèche du milieu pointait vers la <b>gauche</b> :'
      },
      shouldClickRight: {
        en: 'you should have clicked the <b>right</b> button.',
        fr: 'vous auriez dû cliquer sur le bouton de <b>droite</b>.'
      },
      shouldClickLeft: {
        en: 'you should have clicked the <b>left</b> button.',
        fr: 'vous auriez dû cliquer sur le bouton de <b>gauche</b>.'
      },
      shouldPress: {
        en: "you should have pressed the <b>'{key}'</b> keyboard key.",
        fr: "vous auriez dû appuyer sur la touche <b>'{key}'</b> du clavier."
      }
    },
    timeout: {
      tooLong: {
        en: 'You took too long to respond.',
        fr: 'Vous avez mis trop de temps à répondre.'
      },
      tryQuicker: {
        en: 'Try to be quicker',
        fr: "Essayez d'être plus rapide"
      },
      atClicking: {
        en: 'at clicking the response buttons.',
        fr: 'à cliquer sur les boutons de réponse.'
      },
      atPressing: {
        en: "at pressing the <b>'{leftKey}'</b> or <b>'{rightKey}'</b> keyboard key.",
        fr: "à appuyer sur la touche <b>'{leftKey}'</b> ou <b>'{rightKey}'</b> du clavier."
      }
    },
    speedAccuracy: {
      quickly: {
        en: 'You should try to respond<br>as <b>QUICKLY</b> as possible while still being accurate.<br><br>',
        fr: 'Vous devriez essayer de répondre<br>le plus <b>RAPIDEMENT</b> possible tout en restant précis.<br><br>'
      },
      accurately: {
        en: 'You should try to respond<br>as <b>ACCURATELY</b> as possible while still being fast.<br><br>',
        fr: 'Vous devriez essayer de répondre<br>le plus <b>PRÉCISÉMENT</b> possible tout en restant rapide.<br><br>'
      },
      both: {
        en: 'You should try to respond<br>as quickly and accurately as possible.<br><br>',
        fr: 'Vous devriez essayer de répondre<br>aussi rapidement et précisément que possible.<br><br>'
      }
    },
    instructions: {
      title: {
        en: 'TMB Flanker Attention',
        fr: 'TMB Attention Flanker'
      },
      heading: {
        en: 'Instructions',
        fr: 'Instructions'
      },
      youWillSee: {
        en: 'You will see 5 arrows:',
        fr: 'Vous verrez 5 flèches :'
      },
      payAttention: {
        en: 'Pay attention to the arrow in the <i>middle</i><br>and ignore the arrows on the sides.',
        fr: 'Concentrez-vous sur la flèche du <i>milieu</i><br>et ignorez les flèches sur les côtés.'
      },
      whenRightTaps: {
        en: 'When the arrow in the middle points<br>to the <b>right</b>, tap the <b>right</b> button<br>with your <b>right</b> hand.',
        fr: 'Lorsque la flèche du milieu pointe<br>vers la <b>droite</b>, touchez le bouton de <b>droite</b><br>avec votre main <b>droite</b>.'
      },
      whenRightKeys: {
        en: "When the arrow in the middle points<br>to the <b>right</b>, press the <b>'{key}'</b> keyboard key<br>with your <b>right</b> hand.",
        fr: "Lorsque la flèche du milieu pointe<br>vers la <b>droite</b>, appuyez sur la touche <b>'{key}'</b><br>avec votre main <b>droite</b>."
      },
      whenLeftTaps: {
        en: 'When the arrow in the middle points<br>to the <b>left</b>, tap the <b>left</b> button<br>with your <b>left</b> hand.',
        fr: 'Lorsque la flèche du milieu pointe<br>vers la <b>gauche</b>, touchez le bouton de <b>gauche</b><br>avec votre main <b>gauche</b>.'
      },
      whenLeftKeys: {
        en: "When the arrow in the middle points<br>to the <b>left</b>, press the <b>'{key}'</b> keyboard key<br>with your <b>left</b> hand.",
        fr: "Lorsque la flèche du milieu pointe<br>vers la <b>gauche</b>, appuyez sur la touche <b>'{key}'</b><br>avec votre main <b>gauche</b>."
      },
      letsPractice: {
        en: "Let's do some practice.",
        fr: "Faisons quelques essais d'entraînement."
      },
      wellDone: {
        en: 'Well done!',
        fr: 'Bien joué !'
      },
      noticedPlus: {
        en: 'You probably noticed the "+" sign.',
        fr: 'Vous avez probablement remarqué le signe « + ».'
      },
      usePlus: {
        en: 'You can use the "+" sign to help<br>you focus for the next arrow.',
        fr: 'Vous pouvez utiliser le signe « + » pour<br>vous aider à vous concentrer sur la prochaine flèche.'
      },
      morePractice: {
        en: "Let's do some more practice.",
        fr: "Faisons encore quelques essais d'entraînement."
      },
      fasterNow: {
        en: 'Now the sequence will be faster.',
        fr: 'La séquence sera maintenant plus rapide.'
      }
    },
    test: {
      excellent: {
        en: 'Excellent!',
        fr: 'Excellent !'
      },
      nowReal: {
        en: 'Now comes the real test.',
        fr: 'Voici maintenant le vrai test.'
      },
      threeParts: {
        en: 'This test has three parts.<br>Each part has 32 sets of arrows.',
        fr: 'Ce test comporte trois parties.<br>Chaque partie comprend 32 séries de flèches.'
      },
      respondQuickly: {
        en: 'Respond as quickly and accurately as you can.',
        fr: 'Répondez aussi rapidement et précisément que possible.'
      },
      greatJob: {
        en: 'Great job!',
        fr: 'Excellent travail !'
      },
      completedFirst: {
        en: 'You just completed the first part of this test.<br>There are two more parts.',
        fr: 'Vous venez de terminer la première partie de ce test.<br>Il reste deux parties.'
      },
      letsDoMore: {
        en: "Let's do more!",
        fr: 'Continuons !'
      },
      niceGoing: {
        en: 'Nice going!',
        fr: 'Bravo !'
      },
      oneMore: {
        en: 'One more part and you are done!',
        fr: 'Encore une partie et vous aurez terminé !'
      }
    }
  }
});
