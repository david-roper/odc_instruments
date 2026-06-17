// @ts-nocheck
/* eslint-disable */

import { inconsolataFontUrl } from './font.ts';
import { translator } from './translator.ts';

export function render(done) {
  translator.init();

  // inject the Inconsolata @font-face from the embedded base64 data URL so the
  // monospace arrow stimuli render crisply (with a system monospace fallback)
  var fontStyle = document.createElement('style');
  fontStyle.appendChild(
    document.createTextNode(
      "@font-face{font-family:'Inconsolata';src:url('" + inconsolataFontUrl + "') format('truetype');}"
    )
  );
  document.head.appendChild(fontStyle);

  function tFormat(key, vars) {
    var s = translator.t(key);
    if (vars) {
      for (var k in vars) s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
    }
    return s;
  }

  // Globals
  var testVersion; // version identifier for this test
  var frameSequence = []; // object containing the sequence of frames and their properties
  var frame; // single frame object
  var chain; // chain of timeouts for stimulus presentation
  var chainSeq = []; // array of stimulus events to schedule
  var responseErrors = 0; // errors' counter
  var score; // final score
  var results = []; // array to store trials details and responses
  var outcomes = {}; // object containing outcome variables
  var deviceInfo; // variable for logging device info
  var testStartTime; // timestamp of test start (since Unix epoch)
  var flankerstime; // exposure of flankers in ms
  var targettime; // exposure of target in ms
  var fixationtime; // delay b/w target and fixation in ms
  var leftKey; // keyboard key for left response
  var rightKey; // keyboard key for right response
  var chosenInput; // input type (taps or keys)
  var repeated = 0; // whether the current trial has been repeated
  var seed; // URL parameter: random number generator seed
  var nopractice; // URL parameter: no practice trials
  var debug; // URL parameter: output to console
  var demo; // URL parameter: run in demo mode
  var showresults; // URL parameter: if they want to show results in a popup window
  var autosave; // URL parameter: if they want to save data in a file automatically
  var filename; // URL parameter: filename for data
  var usage = ''; // URL parameter: show usage

  tmbUI.onreadyUI = function () {
    var right, left, correct, errorMessage;

    // if we are debugging and there was an error, log the message
    if (debug === 'true' && tmbUI.message) console.log(tmbUI.message);

    // clear the stimulus chain, in case it's still running
    clearChainTimeouts(chain);

    // is the response correct?
    right = ~frame.stim.indexOf('Right');
    left = ~frame.stim.indexOf('Left');
    correct =
      (tmbUI.response === (chosenInput === 'taps' ? 'rightButton' : rightKey) && right) ||
      (tmbUI.response === (chosenInput === 'taps' ? 'leftButton' : leftKey) && left)
        ? 1
        : 0;
    if (!correct) responseErrors++;

    // store the results
    results.push({
      trialId: frame.trial_id,
      trialType: frame.type.indexOf('test') > -1 ? 'test' : 'practice', // one of practice or test
      trialBlock: frame.type, // trial block (e.g., practice1, test1)
      target: frame.stim.indexOf('Right') > -1 ? 'right' : 'left', // one of right or left
      flankers: frame.flankers.indexOf('Right') > -1 ? 'right' : 'left', // one of right or left
      congruent: frame.stim.indexOf('incongruent') > -1 ? 0 : 1, // boolean for congruent
      response: tmbUI.response === (chosenInput === 'taps' ? 'leftButton' : leftKey) ? 'left' : 'right', // one of left or right
      correct: correct, // 1 for correct, 0 for error
      rt: tmbUI.rt, // delay b/w onset of flankers and response
      flagged: frame.type.indexOf('practice') > -1 || tmbUI.status === 'timeout' ? null : tmbUI.rt < 200 ? 1 : 0, // whether test trials are flagged for a qc violation
      repeated: repeated, // whether this trial has a prior timeout
      state: tmbUI.status, // state of the response handler
      timestamp: Date.now() // unix ms timestamp of response
    });

    // deal with errors during practice by repeating instructions
    // and repeating the trial
    if (~frame.type.indexOf('practice') && !correct) {
      // mark this incorrect response/timeout on retry
      repeated = 1;

      // change certain results values to null when timeout
      if (tmbUI.status === 'timeout') {
        // change certain results values to null
        results[results.length - 1].rt = null;
        results[results.length - 1].correct = null;
        results[results.length - 1].response = null;
      }

      errorMessage = right
        ? translator.t('feedback.middleRight') +
          '<br>' +
          "<span style='font-family: Inconsolata, monospace; font-size: 70pt'>></span><br>" +
          (chosenInput === 'taps'
            ? translator.t('feedback.shouldClickRight') + '<br><br>'
            : tFormat('feedback.shouldPress', { key: rightKey }) + '<br><br>')
        : translator.t('feedback.middleLeft') +
          '<br>' +
          "<span style='font-family: Inconsolata, monospace; font-size: 70pt'><</span><br>" +
          (chosenInput === 'taps'
            ? translator.t('feedback.shouldClickLeft') + '<br><br>'
            : tFormat('feedback.shouldPress', { key: leftKey }) + '<br><br>');

      document.body.style.background = '#ffffff'; //white

      showAlert(
        errorMessage,
        chosenInput === 'taps' ? translator.t('buttons.clickRetry') : '',
        function () {
          hideCursor('document.body');
          document.body.style.background = '#e0e0e0'; // grey
          frameSequence.unshift(frame);
          showFrame('leftButton', 'rightButton');
          setTimeout(function () {
            nextTrial();
          }, 1000);
        },
        '20pt',
        null,
        chosenInput === 'taps' ? null : translator.t('buttons.spaceRetry')
      );
    }
    // if the input event returns a timeout,
    // stop the sequence and advise the participant
    else if (tmbUI.status === 'timeout') {
      // mark this timeout on retry
      repeated = 1;

      // change certain results values to null
      results[results.length - 1].rt = null;
      results[results.length - 1].correct = null;
      results[results.length - 1].response = null;

      document.body.style.background = '#ffffff'; // white

      showAlert(
        translator.t('timeout.tooLong') +
          '<br><br>' +
          translator.t('timeout.tryQuicker') +
          '<br>' +
          (chosenInput === 'taps'
            ? translator.t('timeout.atClicking') + '<br><br>'
            : tFormat('timeout.atPressing', { leftKey: leftKey, rightKey: rightKey }) + '<br><br>'),
        chosenInput === 'taps' ? translator.t('buttons.clickRetry') : '',
        function () {
          hideCursor('document.body');
          document.body.style.background = '#e0e0e0'; //grey
          frameSequence.unshift(frame);
          showFrame('leftButton', 'rightButton');
          setTimeout(function () {
            nextTrial();
          }, 1000);
        },
        '20pt',
        null,
        chosenInput === 'taps' ? null : translator.t('buttons.spaceRetry')
      );
    }
    // else all is good, advance to the next trial
    else {
      // if we are debugging, log the results
      if (debug === 'true') logResults(results, 'inc');

      // resetting repeated variable when no timeout
      repeated = 0;
      nextTrial();
    }
  };

  function nextTrial() {
    var intervals = [];

    // read the frame sequence one frame at a time
    frame = frameSequence.shift();
    if (frame) {
      // check if it's the startup frame
      if (frame.type === 'begin') {
        showAlert(
          frame.message,
          chosenInput === 'taps' ? translator.t('buttons.clickInstructions') : '',
          function () {
            nextTrial();
          },
          '20pt',
          null,
          chosenInput === 'taps' ? null : translator.t('buttons.spaceInstructions')
        );
      }
      // check if it's a message frame
      else if (frame.type === 'message') {
        // change highlighting style, if needed
        if (
          frameSequence.filter((x) => x.type === 'practice1').length === 0 &&
          tmbUI.highlight === 'responseIconHighlightPractice'
        ) {
          tmbUI.highlight = 'responseIconHighlight';
        }

        // before commencing a block of trials
        // (except the first block), we warn the participant to emphasize
        // speed or accuracy based on previous number of errors
        if (frame.feedback === 'speedaccuracy') {
          if (responseErrors <= 2) frame.message += translator.t('speedAccuracy.quickly');
          else if (responseErrors >= 4) frame.message += translator.t('speedAccuracy.accurately');
          else frame.message += translator.t('speedAccuracy.both');
        }

        // reset the errors' counter
        responseErrors = 0;

        document.body.style.background = '#ffffff'; //white

        showAlert(
          frame.message,
          chosenInput === 'taps' ? translator.t('buttons.clickContinue') : '',
          function () {
            hideCursor('document.body');
            showFrame('null');
            setTimeout(function () {
              nextTrial();
            }, 1000);
          },
          '20pt',
          null,
          chosenInput === 'taps' ? null : translator.t('buttons.spaceContinue')
        );
      }
      // else show the stimulus
      else {
        // setup the stimulus' delays
        if (frame.type === 'practice1') intervals = [1000, 600, 500, 0];
        else intervals = [1000, flankerstime, targettime, fixationtime];

        // build the stimulus chain
        chainSeq = [
          function () {
            requestAnimationFrame(function () {
              hideCursor('document.body');
              showFrame('leftButton', 'rightButton');
              document.body.offsetHeight;
            });
          },
          intervals[0], // ITI
          function () {
            requestAnimationFrame(function () {
              showFrame(frame.flankers, 'leftButton', 'rightButton');
              document.body.offsetHeight;
              tmbUI.getInput();
            });
          },
          intervals[1], // flankers-target asynchrony
          function () {
            requestAnimationFrame(function () {
              showFrame(frame.stim, 'leftButton', 'rightButton');
              document.body.offsetHeight;
            });
          },
          intervals[2], // target duration
          intervals[3] // target-fixation asynchrony
            ? [
                function () {
                  requestAnimationFrame(function () {
                    showFrame('leftButton', 'rightButton');
                    document.body.offsetHeight;
                  });
                },
                intervals[3],
                function () {
                  requestAnimationFrame(function () {
                    showFrame('fixation', 'leftButton', 'rightButton');
                    document.body.offsetHeight;
                  });
                }
              ]
            : function () {
                requestAnimationFrame(function () {
                  showFrame('fixation', 'leftButton', 'rightButton');
                  document.body.offsetHeight;
                });
              }
        ];
        chainSeq = chainSeq.flatten();

        hideCursor('document.body');
        document.body.style.background = '#e0e0e0'; // grey

        // chain the stimulus presentation
        chain = chainTimeouts(chainSeq);
      }
    }
    // else the sequence is empty, we are done!
    else {
      var tmp1, tmp2, congTrials, incongTrials;

      showCursor('document.body');

      // all test trials (excluding practice and timeouts)
      tmp1 = results.filter(function (obj) {
        return obj.trialType !== 'practice' && obj.state !== 'timeout';
      });

      // correct trials only
      tmp2 = tmp1
        .filter(function (obj) {
          return obj.correct === 1;
        })
        .pluck('rt');

      outcomes.accuracy = tmp2.length / tmp1.length;
      outcomes.meanRTc = tmp2.length ? tmp2.average().round(2) : null;
      outcomes.medianRTc = tmp2.length ? tmp2.median().round(2) : null;
      outcomes.sdRTc = tmp2.length > 1 ? tmp2.sd().round(2) : null;

      // congruent trials
      congTrials = tmp1.filter(function (obj) {
        return obj.congruent === 1;
      });

      // incongruent trials
      incongTrials = tmp1.filter(function (obj) {
        return obj.congruent === 0;
      });

      outcomes.medianRT_congruent = congTrials.pluck('rt').median();
      outcomes.medianRT_incongruent = incongTrials.pluck('rt').median();
      outcomes.accuracy_congruent = congTrials.pluck('correct').average();
      outcomes.accuracy_incongruent = incongTrials.pluck('correct').average();
      outcomes.rcs_congruent = ((1000 * outcomes.accuracy_congruent) / outcomes.medianRT_congruent).round(4);
      outcomes.rcs_incongruent = ((1000 * outcomes.accuracy_incongruent) / outcomes.medianRT_incongruent).round(4);
      outcomes.accuracy_interference = (outcomes.accuracy_congruent - outcomes.accuracy_incongruent).round(4);
      outcomes.medianRT_interference = (outcomes.medianRT_incongruent - outcomes.medianRT_congruent).round(4);
      outcomes.rcs_interference = (outcomes.rcs_congruent - outcomes.rcs_incongruent).round(4);
      outcomes.flag_medianRTc = outcomes.medianRTc >= 400 ? 0 : 1;
      outcomes.flag_accuracy = outcomes.accuracy < 0.65 ? 1 : 0;
      outcomes.flag_trialFlags = tmp1.pluck('flagged').average() > 0.1 ? 1 : 0;

      //overall qc flag
      outcomes.flag_any = outcomes.flag_medianRTc + outcomes.flag_accuracy + outcomes.flag_trialFlags > 0 ? 1 : 0;
      outcomes.didPracticeTrials = nopractice === 'true' ? 0 : 1;

      // create a score with range 0 - 100 based on rate correct score
      // (assume fastest plausible rcs of 2.5 = 100% accuracy
      // with 400 ms medianRT)
      score = outcomes.score = ((100 * ((1000 * outcomes.accuracy) / tmp1.pluck('rt').median())) / 2.5).round(2);
      if (score > 100) score = outcomes.score = 100;

      // response device
      tmp2 = tmp1.length ? tmp1[0].state : 'none';
      tmp2 = /key/i.test(tmp2)
        ? 'keyboard'
        : /touch/i.test(tmp2)
          ? 'touch'
          : /mouse/i.test(tmp2)
            ? 'mouse'
            : /pen/i.test(tmp2)
              ? 'pen'
              : 'unknown';

      outcomes.responseDevice = tmp2;
      outcomes.testVersion = testVersion;
      outcomes.type = 'summaryScores';

      // if debugging, output to console
      if (debug === 'true') logResults([outcomes], 'cum');

      done({ results: results, outcomes: outcomes });
    }
  }

  function setFrameSequence() {
    var TestMessage,
      i,
      j,
      tempArray = [];

    // whether practice trials will be administered
    var doPractice = !nopractice || nopractice === 'false';

    // stimulus types
    var targetType = ['congruentRight', 'congruentLeft', 'incongruentRight', 'incongruentLeft'];
    var flankerType = ['flankersRight', 'flankersLeft'];

    // messages
    TestMessage = {
      begin:
        '<h2>' +
        translator.t('instructions.title') +
        '</h2>' +
        "<span style='font-size:60pt; font-family: Inconsolata, monospace'><<><<</span><br><br>",
      practice: [
        '<h3>' +
          translator.t('instructions.heading') +
          '</h3><br>' +
          translator.t('instructions.youWillSee') +
          '<br><br>' +
          "<span style='font-size:60pt; font-family: Inconsolata, monospace'><<><<</span><br>" +
          "<img src='fingerUp.png' alt='finger up'><br>" +
          translator.t('instructions.payAttention') +
          '<br><br>',
        '<h3>' +
          translator.t('instructions.heading') +
          '</h3>' +
          "<span style='font-size:60pt; font-family: Inconsolata, monospace'><<<span class='blink'>></span><<</span><br>" +
          (chosenInput === 'taps'
            ? "<pre><img src='leftButton.png' alt='left button'>      " +
              "<img src='fingerRight.png' alt='finger right'>" +
              "<img src='rightButton.png' alt='right button'></pre>"
            : '') +
          (chosenInput === 'taps'
            ? translator.t('instructions.whenRightTaps') + '<br><br>'
            : tFormat('instructions.whenRightKeys', { key: rightKey }) +
              "<br><pre><img src='pressM_icon.png' class='small' alt='m key'></pre>"),
        '<h3>' +
          translator.t('instructions.heading') +
          '</h3>' +
          "<span style='font-size:60pt; font-family: Inconsolata, monospace'>>><span class='blink'><</span>>></span><br>" +
          (chosenInput === 'taps'
            ? "<pre><img src='leftButton.png' alt='left button'>" +
              "<img src='fingerLeft.png' alt='finger left'>       " +
              "<img src='rightButton.png' alt='right button'></pre>"
            : '') +
          (chosenInput === 'taps'
            ? translator.t('instructions.whenLeftTaps') + '<br><br>'
            : tFormat('instructions.whenLeftKeys', { key: leftKey }) +
              "<br><pre><img src='pressX_icon.png' class='small' alt='x key'></pre>") +
          (doPractice ? translator.t('instructions.letsPractice') + '<br><br>' : ''),
        translator.t('instructions.wellDone') +
          '<br><br>' +
          translator.t('instructions.noticedPlus') +
          '<br><br>' +
          translator.t('instructions.usePlus') +
          '<br><br>',
        translator.t('instructions.morePractice') + '<br><br>' + translator.t('instructions.fasterNow') + '<br><br>'
      ],
      test: [
        (doPractice
          ? '<br>' + translator.t('test.excellent') + '<br><br>' + translator.t('test.nowReal') + '<br><br>'
          : '') +
          translator.t('test.threeParts') +
          '<br><br>' +
          translator.t('test.respondQuickly') +
          '<br><br>',
        '<br>' +
          translator.t('test.greatJob') +
          '<br><br>' +
          translator.t('test.completedFirst') +
          '<br><br>' +
          translator.t('test.letsDoMore') +
          '<br><br>',
        '<br>' + translator.t('test.niceGoing') + '<br><br>' + translator.t('test.oneMore') + '<br><br>'
      ]
    };

    // Practice sequence

    // type of frame to display
    var frameType = ['begin', 'message', 'message', 'message'];

    // trial_id
    var trial_id = [null, null, null, null];

    // message to display
    var frameMessage = [TestMessage.begin, TestMessage.practice[0], TestMessage.practice[1], TestMessage.practice[2]];

    // requires feedback?
    var frameFeedback = ['', '', '', ''];

    // flanker type (left or right)
    var frameFlankers = ['', '', '', ''];

    // target type (incongruent or congruent, left or right)
    var frameStim = ['', '', '', ''];

    // setup properties for practice trials
    if (doPractice) {
      frameType = frameType.concat([
        'practice1',
        'practice1',
        'practice1',
        'practice1',
        'message',
        'message',
        'practice2',
        'practice2',
        'practice2',
        'practice2'
      ]);

      trial_id = trial_id.concat([
        'practice1',
        'practice2',
        'practice3',
        'practice4',
        null,
        null,
        'practice5',
        'practice6',
        'practice7',
        'practice8'
      ]);

      frameMessage = frameMessage.concat([
        '',
        '',
        '',
        '',
        TestMessage.practice[3],
        TestMessage.practice[4],
        '',
        '',
        '',
        ''
      ]);

      frameFeedback = frameFeedback.concat(['', '', '', '', '', '', '', '', '', '']);

      frameFlankers = frameFlankers.concat([
        flankerType[0],
        flankerType[1],
        flankerType[1],
        flankerType[0],
        '',
        '',
        flankerType[0],
        flankerType[1],
        flankerType[1],
        flankerType[0]
      ]);

      frameStim = frameStim.concat([
        targetType[0],
        targetType[1],
        targetType[2],
        targetType[3],
        '',
        '',
        targetType[0],
        targetType[1],
        targetType[2],
        targetType[3]
      ]);
    }

    // tests

    // run 3 blocks
    var trialCount = 0;
    for (i = 0; i < 3; i++) {
      frameType.push('message');
      frameFeedback.push(i === 0 ? '' : 'speedaccuracy');
      frameMessage.push(TestMessage.test[i]);
      frameStim.push('');
      frameFlankers.push('');
      trial_id.push(null);

      // each block has 32 trials
      // same number of congruent/incongruent and left/right
      tempArray = [];
      for (j = 0; j < 8; j++) tempArray.push(targetType[0], targetType[1]);
      for (j = 0; j < 8; j++) tempArray.push(targetType[2], targetType[3]);
      tempArray = tempArray.flatten().shuffle();

      for (j = 0; j < 32; j++) {
        trialCount++;
        trial_id.push('test' + trialCount);
        frameType.push('test' + (i + 1));
        frameFeedback.push('');
        frameMessage.push('');
        frameStim.push(tempArray[j]);
        frameFlankers.push(
          tempArray[j] === 'congruentRight' || tempArray[j] === 'incongruentLeft' ? flankerType[0] : flankerType[1]
        );
      }
    }

    // push all components into the frames chain
    for (i = 0; i < frameType.length; i++) {
      frameSequence.push({
        trial_id: trial_id[i],
        type: frameType[i],
        feedback: frameFeedback[i],
        message: frameMessage[i],
        flankers: frameFlankers[i],
        stim: frameStim[i]
      });
    }

    //start the testing sequence
    nextTrial();
  }

  (function () {
    var copyright = 'Copyright ' + document.querySelector('meta[name="copyright"]').content;
    var scriptName = window.location.pathname.split('/').pop();

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
          '<i>nopractice=true</i> -- omits practice trials<br>' +
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

    // check if this is a debug session
    debug = getUrlParameters('debug', '', true);

    // check if they want to load results in a new page when the test is over,
    // if data is to be saved automatically to a file and the filename
    showresults = getUrlParameters('showresults', '', true);
    autosave = getUrlParameters('autosave', '', true);
    filename = getUrlParameters('filename', '', true);

    // check if they want to bypass practice
    nopractice = getUrlParameters('nopractice', '', true);

    // timing parameters
    flankerstime = 100;
    targettime = 300;
    fixationtime = 70;

    // set response timeout to 3 seconds
    tmbUI.timeout = 3000;

    // set the random generator's seed
    seed = getUrlParameters('seed', '', true);
    if (!(seed = parseInt(seed))) seed = 'FlankerTask';
    Math.seedrandom(seed);

    // set the test version
    testVersion = scriptName.replace(/\.[^/.]+$/, '');

    // disable spurious user interactions
    disableSelect();
    disableRightClick();
    disableDrag();
    disableElasticScrolling();
    disableDoubleTapZoom();

    // set the scale for mobile devices
    setBodyScale(700, 650);

    // get device info
    deviceInfo = deviceScan();

    // test start time
    testStartTime = Date.now();

    function setInput(input) {
      // set keyboard response keys
      leftKey = 'x';
      rightKey = 'm';

      // determine events to listen to
      if (input === 'taps') {
        tmbUI.UIevents = ['taps'];
        getID('leftButton').innerHTML = '<';
        getID('rightButton').innerHTML = '>';
        tmbUI.highlight = 'responseHighlight';
      } else {
        tmbUI.UIevents = ['keys'];
        tmbUI.UIkeys = [keyToCode(leftKey), keyToCode(rightKey)];
        getID('leftButton').classList.remove('responseButton');
        getID('rightButton').classList.remove('responseButton');
        getID('leftButton').classList.add('responseIcon');
        getID('rightButton').classList.add('responseIcon');
        getID('leftButton').innerHTML = "<img src='pressX_icon.png' class='rounded-corners' alt='x key'>";
        getID('rightButton').innerHTML = "<img src='pressM_icon.png' class='rounded-corners' alt='m key'>";
        getID('leftButton').style.marginLeft = '-262px';
        getID('rightButton').style.marginLeft = '110px';
        tmbUI.highlight = 'responseIconHighlightPractice';
      }
      tmbUI.UIelements = ['leftButton', 'rightButton'];

      chosenInput = input;

      //hide cursor
      hideCursor('document.body');

      // preload images, then create the trials chain and start the sequence
      imagePreLoad(
        [
          'fingerUp.png',
          'fingerLeft.png',
          'fingerRight.png',
          'leftButton.png',
          'rightButton.png',
          'pressM_icon.png',
          'pressX_icon.png'
        ],
        { pipeline: false, callBack: setFrameSequence }
      );
    }

    if (!hasTouch) setInput('keys');
    else chooseInput({ keyboard: true, touch: true }, setInput);
  })();
}
