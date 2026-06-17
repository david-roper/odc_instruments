// @ts-nocheck
/* eslint-disable */

import { translator } from './translator.ts';

export function render(done) {
  translator.init();

  function tFormat(key, vars) {
    var s = translator.t(key);
    if (vars) {
      for (var k in vars) s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
    }
    return s;
  }

  var testVersion; // version identifier for this test
  var wordPairs = []; // array of probe-target words
  var pairsCount = 0; // count of already seen word pairs
  var ISI = 500; // inter-stimulus interval
  var correct; // correct=1, wrong=0
  var score = 0; // accumulated score
  var repeated = 0; // variable to log whether a trial has been repeated
  var results = []; // array to store trials details and responses
  var outcomes = {}; // object containing outcome variables
  var frameSequence = []; // object containing the sequence of frames and their properties
  var frame; // single frame object
  var inputFile; // URL parameter: file containing probe-target word pairs
  var inputPrefix; // URL parameter: prefix of input file, when using multiple forms
  var seed; // URL parameter: which input form should be used (int)
  var debug; // URL parameter: output to console
  var showresults; // URL parameter: if they want to show results in a popup window
  var autosave; // URL parameter: if they want to save data in a file automatically
  var filename; // URL parameter: filename for data
  var usage = ''; // URL parameter: show usage

  // specify actions to take on user input
  tmbUI.onreadyUI = function () {
    var choice, isTimeout;

    // if we are debugging and there was an error, log the message
    if (debug === 'true' && tmbUI.message) console.log(tmbUI.message);

    // did the trial time out?
    isTimeout = tmbUI.status === 'timeout';

    // retrieve which word they chose
    if (tmbUI.response) {
      if (tmbUI.status === 'keyup') {
        choice = getID('choice' + tmbUI.response.replace('numpad', '')).innerHTML;
      } else choice = getID(tmbUI.response).innerHTML;
      choice = choice.slice(3).toLowerCase().trim();
    } else choice = 'none';

    // is the response correct?
    correct = choice === frame.target.toLowerCase().trim() ? 1 : 0;

    results.push({
      type: frame.type, // one of practice or test
      probe: frame.probe, // probe word
      target: frame.target, // target word
      response: choice, // the chosen word
      responseTimestamp: now(), // timestamp of response, ms since test load
      correct: isTimeout ? null : correct, // boolean correct
      rt: isTimeout ? null : tmbUI.rt, // response time
      repeated: repeated, // whether this trial has previously been attempted
      state: tmbUI.status // state of the response handler
    });

    // if we are debugging, log the results
    if (debug === 'true') logResults(results, 'inc');

    if (frame.type === 'practice') {
      // on practice trials, if the input event returns a timeout
      // or the response is not correct,
      // stop the sequence and advise the participant
      if (isTimeout || !correct) {
        // rewind the frame sequence by one frame,
        // so that the same frame is displayed again
        frameSequence.unshift(frame);

        // mark trial as repeated for next attempt
        repeated = 1;

        showAlert(
          translator.t('feedback.pairYouLearned') +
            '<br>' +
            "<b>'" +
            frame.probe +
            ' - ' +
            frame.target +
            "'</b><br>" +
            '<br>' +
            tFormat('feedback.clickTarget', { target: frame.target }) +
            '<br><br>',
          translator.t('buttons.clickRetry'),
          function () {
            showFrame('null');
            nextTrial();
          },
          '20pt'
        );
      } else {
        // mark trial as NOT repeated for next attempt
        repeated = 0;

        showFrame('null');
        nextTrial();
      }
    } else if (frame.type === 'test') {
      // if the input event returns a timeout,
      // stop the sequence and advise the participant
      if (isTimeout) {
        // rewind the frame sequence by one frame,
        // so that the same frame is displayed again
        frameSequence.unshift(frame);
        pairsCount--;

        // mark trial as repeated for next attempt
        repeated = 1;

        showAlert(
          translator.t('feedback.takingTooLong') +
            '<br><br>' +
            tFormat('feedback.clickGoesWith', { probe: frame.probe }) +
            '<br><br>',
          translator.t('buttons.clickRetry'),
          function () {
            showFrame('null');
            nextTrial();
          },
          '20pt'
        );
      } else {
        // mark trial as NOT repeated for next attempt
        repeated = 0;

        showFrame('null');
        nextTrial();
      }
    }
  };

  // iterate through the frameSequence object,
  // implementing stimulus presentation,
  // response collection and data management
  function nextTrial() {
    // read the frame sequence one frame at a time
    frame = frameSequence.shift();
    if (frame) {
      // check if it's the startup frame
      if (frame.type === 'begin')
        showAlert(
          frame.message,
          translator.t('buttons.clickInstructions'),
          function () {
            showFrame('null');
            nextTrial();
          },
          '20pt'
        );
      // else if it's a message frame, show it
      else if (frame.type === 'message')
        showAlert(
          frame.message,
          translator.t('buttons.clickContinue'),
          function () {
            showFrame('null');
            nextTrial();
          },
          '20pt'
        );
      // deal with practice and test frames
      else {
        chainTimeouts(
          function () {
            if (frame.type === 'test') {
              pairsCount++;
              getID('counter').innerHTML =
                '<b>' + pairsCount + ' ' + translator.t('counter.of') + ' ' + wordPairs.length + '</b>';
            } else {
              getID('counter').innerHTML = '<b>' + translator.t('counter.practice') + '</b>';
            }
            showFrame('counter');
          },
          ISI,
          function () {
            getID('probe').innerHTML = frame.probe.toUpperCase() + ' - ?';
            getID('choice1').innerHTML = '1. ' + frame.choice1.toUpperCase();
            getID('choice2').innerHTML = '2. ' + frame.choice2.toUpperCase();
            getID('choice3').innerHTML = '3. ' + frame.choice3.toUpperCase();
            getID('choice4').innerHTML = '4. ' + frame.choice4.toUpperCase();
            showFrame('counter', 'probe', 'choice');
            tmbUI.getInput();
          }
        );
      }
    }
    // else the sequence is empty, we are done!
    else {
      //compute outcomes
      var tmp1, tmp2, tmp3;

      // all test trials (excluding practice and timeouts)
      tmp1 = results.filter(function (obj) {
        return obj.type !== 'practice' && obj.state !== 'timeout';
      });

      // all correct rts
      tmp2 = tmp1
        .filter(function (obj) {
          return obj.correct === 1;
        })
        .pluck('rt');

      // response device
      tmp3 = tmp1[0].state;
      tmp3 = /key/i.test(tmp3)
        ? 'keyboard'
        : /touch/i.test(tmp3)
          ? 'touch'
          : /mouse/i.test(tmp3)
            ? 'mouse'
            : /pen/i.test(tmp3)
              ? 'pen'
              : 'unknown';

      score = outcomes.score = tmp2.length;
      outcomes.accuracy = tmp2.length ? tmp2.length / tmp1.length : 0;
      outcomes.meanRTc = tmp2.length ? tmp2.average().round(2) : null;
      outcomes.medianRTc = tmp2.length ? tmp2.median().round(2) : null;
      outcomes.sdRTc = tmp2.length > 1 ? tmp2.sd().round(2) : null;
      outcomes.flag_medianRTc = outcomes.medianRTc >= 1000 ? 0 : 1;
      outcomes.flag_any = outcomes.flag_medianRTc > 0 ? 1 : 0;
      outcomes.responseDevice = tmp3;
      outcomes.testVersion = testVersion;

      done({ outcomes, results });

      // // if debugging, output to console
      // if (debug === 'true') logResults([outcomes], 'cum');

      // // we either save locally or to the server
      // if (showresults === 'true' || autosave === 'true' || filename) {
      //   // append outcomes to results
      //   outcomes.type = 'summaryScores';
      //   results.push(outcomes);

      //   showAlert(
      //     'Your score is ' + score + '.<br>' + '<br>The test is over.<br>' + 'Thank you for participating!<br><br>',
      //     '',
      //     null,
      //     '20pt'
      //   );

      //   setTimeout(function () {
      //     if (filename === false) filename = 'VerbalPAresults.csv';
      //     tmbSubmitToFile(results, filename, autosave);
      //   }, 2000);
      // } else {
      //   showAlert('Test complete!', '', function () {}, '20pt');
      // }
    }
  }

  // generate the frameSequence object,
  // where each object's element codes the parameters
  // for a single trial/frame
  function setFrameSequence() {
    var testMessage, i;

    // messages
    testMessage = {
      begin: '<h2>' + translator.t('test.beginTitle') + '</h2>' + translator.t('test.examplePair') + '<br><br>',
      instructions: [
        '<h3>' +
          translator.t('test.instructionsHeading') +
          '</h3>' +
          translator.t('test.examplePair') +
          '<br><br>' +
          translator.t('test.testYourMemory') +
          '<br><br>',
        '<h3>' +
          translator.t('test.instructionsHeading') +
          '</h3>' +
          translator.t('test.forPractice') +
          '<br>' +
          translator.t('test.hintGreen') +
          '<br><br>',
        translator.t('test.excellent') +
          '<br><br>' +
          tFormat('test.recallAll', { count: wordPairs.length }) +
          '<br><br>' +
          translator.t('test.letsStart') +
          '<br><br>'
      ]
    };

    // type of frame to display
    var frameType = ['begin', 'message', 'message', 'practice', 'message'];

    // message to display
    var frameMessage = [
      testMessage.begin,
      testMessage.instructions[0],
      testMessage.instructions[1],
      '',
      testMessage.instructions[2]
    ];

    // words to display (practice pair is language-aware, matching the selected stimuli language)
    var isFr = translator.resolvedLanguage === 'fr';
    var practiceProbe = isFr ? 'ciel' : 'sky';
    var practiceTarget = isFr ? 'vert' : 'green';
    var practiceChoice1 = isFr ? 'pot' : 'pot';
    var practiceChoice2 = isFr ? 'poêle' : 'pan';
    var practiceChoice3 = isFr ? 'vert' : 'green';
    var practiceChoice4 = isFr ? 'plat' : 'dish';

    var frameProbe = ['', '', '', practiceProbe, ''];
    var frameTarget = ['', '', '', practiceTarget, ''];
    var frameChoice1 = ['', '', '', practiceChoice1, ''];
    var frameChoice2 = ['', '', '', practiceChoice2, ''];
    var frameChoice3 = ['', '', '', practiceChoice3, ''];
    var frameChoice4 = ['', '', '', practiceChoice4, ''];

    // push all components into the frames chain
    for (i = 0; i < frameType.length; i++) {
      frameSequence.push({
        type: frameType[i],
        message: frameMessage[i],
        probe: frameProbe[i],
        target: frameTarget[i],
        choice1: frameChoice1[i],
        choice2: frameChoice2[i],
        choice3: frameChoice3[i],
        choice4: frameChoice4[i]
      });
    }

    for (i = 0; i < wordPairs.length; i++) {
      frameSequence.push({
        type: 'test',
        message: '',
        probe: wordPairs[i].probe,
        target: wordPairs[i].target,
        choice1: wordPairs[i].choice1,
        choice2: wordPairs[i].choice2,
        choice3: wordPairs[i].choice3,
        choice4: wordPairs[i].choice4
      });
    }

    // start the trial sequence
    nextTrial();
  }

  // this is the input file's parser: it builds a JSON object
  // from the instructions and material in the file
  function parseFile(text) {
    // parse the input file
    if (text) {
      var lines,
        words = [],
        errors = 0;

      // Parse the file's text into lines by splitting on 'newline'.
      // (do not use regexp, e.g. /\r?\n/, because ie8 throws up)
      lines = text.split('\n');

      // parse each line into words by splitting on 'whitespace'
      for (var i = 0; i < lines.length; i++) {
        // first check if this line is a comment (starts with '*'?)
        if (lines[i].charAt(0) === '*') continue;

        // split on 'whitespace'
        words = lines[i].split(' ');

        // sanitize the words, so there are no linefeeds at the end
        words = words.map(function (s) {
          return s.trim();
        });

        // save probe, target and choice words, or stop and report an error
        if (words.length === 6)
          wordPairs.push({
            probe: words[0],
            target: words[1],
            choice1: words[2],
            choice2: words[3],
            choice3: words[4],
            choice4: words[5]
          });
        else {
          errors++;
          break;
        }
      }

      if (errors) {
        showAlert('parseFile: Incorrect formatting of line ' + (i + 1) + '.', '', null, '20pt');
      } else if (wordPairs.length === 0) {
        showAlert("parseFile: Error parsing input file's content.", '', null, '20pt');
      } else setFrameSequence();
    } else showAlert('ajaxRequest: Error reading input file.', '', null, '20pt');
  }

  // on page load completion, set up initial parameters,
  // call the frameSequence generator
  // and start the trials sequence
  (function () {
    var copyright = 'Copyright ' + document.querySelector('meta[name="copyright"]').content;
    var scriptName = window.location.pathname.split('/').pop();

    // add appropriate meta viewport for scaling
    setBodyScale(600, 700);

    // see if they are just asking for help
    if ((usage = getUrlParameters('help', '', true))) {
      showAlert(
        "<p id='helpSpan'>" +
          '<b>' +
          document.title +
          '</b><br>' +
          '<i>' +
          copyright +
          '</i><br><br>' +
          '<b>Usage:</b>' +
          '<br>' +
          scriptName +
          '?urlParam1=1&urlParam2=0<br><br>' +
          '<b>URL Parameters</b>:<br>' +
          '<i>input=testInput.txt</i> -- word pairs input file<br>' +
          '<i>inputPrefix</i> -- prefix of input file, when using multiple forms<br>' +
          '<i>seed</i> -- which input form should be used (int)<br>' +
          '<i>debug=true</i> -- outputs trial by trial info to the console<br>' +
          '<i>showresults=true</i> -- allows to save results locally in a file<br>' +
          '<i>autosave=true</i> -- will attempt to save results automatically to file<br>' +
          '<i>filename=subject1.csv</i> -- the filename to save results to<br>' +
          '<i>help</i> -- print this message'
      );
      document.getElementById('helpSpan').style.textAlign = 'left';
      document.getElementById('helpSpan').style.margin = '50px';
      return;
    }

    // specify the input file
    inputFile = getUrlParameters('input', '', true);
    if (!inputFile) {
      inputPrefix = getUrlParameters('inputPrefix', '', true);
      seed = getUrlParameters('seed', '', true);

      if (inputPrefix && seed) {
        inputFile = 'VerbalPAtestInput_' + inputPrefix + seed + '.txt';
      } else if (inputPrefix || seed) {
        showAlert(
          "Error: URL parameters 'inputPrefix' and 'seed' must<br>" + "both be provided if 'input' not specified.",
          '',
          null,
          '20pt'
        );
        return;
      } else {
        inputFile = 'VerbalPAtestInput.txt';
      }
    }

    // check if this is a debug session
    debug = getUrlParameters('debug', '', true);

    // check if they want to load results in a new page when the test is over,
    // if data is to be saved automatically to a file and the filename
    showresults = getUrlParameters('showresults', '', true);
    autosave = getUrlParameters('autosave', '', true);
    filename = getUrlParameters('filename', '', true);

    // set the test version
    testVersion = scriptName.replace(/\.[^/.]+$/, '');

    // determine events to listen to
    if (hasTouch || hasPointer) tmbUI.UIevents = ['taps', 'clicks', 'keys'];
    else tmbUI.UIevents = ['clicks', 'keys'];
    tmbUI.UIkeys = [
      keyToCode('1'),
      keyToCode('2'),
      keyToCode('3'),
      keyToCode('4'),
      keyToCode('numpad1'),
      keyToCode('numpad2'),
      keyToCode('numpad3'),
      keyToCode('numpad4')
    ];
    tmbUI.UIelements = ['choice1', 'choice2', 'choice3', 'choice4', 'choice1', 'choice2', 'choice3', 'choice4'];
    tmbUI.highlight = 'responseHighlight';

    // disable spurious user interaction
    disableSelect();
    disableRightClick();
    disableDrag();
    disableDoubleTapZoom();

    // when French is selected, load the French word-pair list
    if (translator.resolvedLanguage === 'fr') {
      inputFile = inputFile.replace(/\.txt$/, '_fr.txt');
    }

    // read the input file and call the parser
    ajaxRequest({ url: inputFile, async: true, callback: parseFile });
  })();
}
