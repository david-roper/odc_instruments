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
    judgement: {
      letter: {
        en: 'letter',
        fr: 'lettre'
      },
      number: {
        en: 'number',
        fr: 'chiffre'
      }
    },
    practiceError: {
      target: {
        en: 'Your target was the <b>{judgement} {target}</b>:',
        fr: 'Votre cible était : <b>{judgement} {target}</b>'
      },
      shouldRight: {
        en: 'you should have clicked<br>the <b>right</b> button.',
        fr: 'vous auriez dû cliquer<br>sur le bouton de <b>droite</b>.'
      },
      shouldLeft: {
        en: 'you should have clicked<br>the <b>left</b> button.',
        fr: 'vous auriez dû cliquer<br>sur le bouton de <b>gauche</b>.'
      }
    },
    timeout: {
      message: {
        en: 'Please respond as quickly as you can.<br><br>Click the left or right button.',
        fr: 'Veuillez répondre aussi vite que possible.<br><br>Cliquez sur le bouton de gauche ou de droite.'
      }
    },
    instructions: {
      title: {
        en: 'Letter/Number Switching',
        fr: 'Alternance lettres/chiffres'
      },
      heading: {
        en: 'Instructions',
        fr: 'Instructions'
      },
      step1: {
        en: 'Here your job is to report<br>either the number or the letter<br>in this letter/number pair.',
        fr: 'Ici, votre tâche est de rapporter<br>soit le chiffre, soit la lettre<br>de cette paire lettre/chiffre.'
      },
      step2: {
        en: 'The word above the letter-number pair<br>tells you what to report<br>(here it’s the <b>number</b>).',
        fr: 'Le mot au-dessus de la paire lettre-chiffre<br>vous indique quoi rapporter<br>(ici, c’est le <b>chiffre</b>).'
      },
      step3: {
        en: 'To report the number <b>1</b>, you click<br>the button that has that number (<b>left</b>).',
        fr: 'Pour rapporter le chiffre <b>1</b>, vous cliquez<br>sur le bouton qui contient ce chiffre (<b>gauche</b>).'
      },
      step4: {
        en: 'To report the letter <b>z</b>, you click<br>the button that has that letter (<b>right</b>).',
        fr: 'Pour rapporter la lettre <b>z</b>, vous cliquez<br>sur le bouton qui contient cette lettre (<b>droite</b>).'
      },
      letsPractice: {
        en: 'Let’s do some practice.',
        fr: 'Faisons quelques essais d’entraînement.'
      },
      excellent: {
        en: 'Excellent!<br>You have completed the practice.<br><br>Now let’s do more.',
        fr: 'Excellent !<br>Vous avez terminé l’entraînement.<br><br>Passons à la suite.'
      }
    },
    test: {
      remember: {
        en: 'Remember!<br><br>Look at the word on top, then <br>click the button that has<br>the letter or number in the pair below.<br><br>Please try to be QUICK,<br>but also ACCURATE.',
        fr: 'Rappel !<br><br>Regardez le mot en haut, puis <br>cliquez sur le bouton qui contient<br>la lettre ou le chiffre de la paire ci-dessous.<br><br>Essayez d’être RAPIDE,<br>mais aussi PRÉCIS.'
      }
    }
  }
});
