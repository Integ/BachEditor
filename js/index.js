var $ = require("jquery");
var Editor = require('./bacheditor');
//var MIDI = require('./MIDI');

$(function() {
  var myEditor = new Editor();
  myEditor.render('#myEditor');
  /* myEditor.render('#myEditor', 'live', function() {
     mario
    var velocity = 127; // how hard the note hits
    var marioKeys = ['E4', 'E4', 'E4', 'C4', 'E4', 'G4', 'G3',
      'C4', 'G3', 'E3', 'A3', 'B3', 'Ab3', 'A3', 'G3', 'E4', 'G4', 'A4', 'F4', 'G4', 'E4', 'C4', 'D4', 'B3',
      'C4', 'G3', 'E3', 'A3', 'B3', 'Ab3', 'A3', 'G3', 'E4', 'G4', 'A4', 'F4', 'G4', 'E4', 'C4', 'D4', 'B3',
      'G4', 'F4', 'E4', 'Db4', 'E4', 'Gb3', 'A3', 'C4', 'A3', 'C4', 'D4', 'G4', 'F4', 'E4', 'Db4', 'E4', 'C5', 'C5', 'C5',
      'G4', 'F4', 'E4', 'Db4', 'E4', 'Gb3', 'A3', 'C4', 'A3', 'C4', 'D4', 'Db4', 'D4', 'C4',
      'C4', 'C4', 'C4', 'C4', 'D4', 'E4', 'C4', 'A3', 'G3', 'C4', 'C4', 'C4', 'C4', 'D4', 'E4',
      'C4', 'C4', 'C4', 'C4', 'D4', 'E4', 'C4', 'A3', 'G3'
    ]; // the MIDI note
    var marioTimes = [
      8, 4, 4, 8, 4, 2, 2,
      3, 3, 3, 4, 4, 8, 4, 8, 8, 8, 4, 8, 4, 3, 8, 8, 3,
      3, 3, 3, 4, 4, 8, 4, 8, 8, 8, 4, 8, 4, 3, 8, 8, 2,
      8, 8, 8, 4, 4, 8, 8, 4, 8, 8, 3, 8, 8, 8, 4, 4, 4, 8, 2,
      8, 8, 8, 4, 4, 8, 8, 4, 8, 8, 3, 3, 3, 1,
      8, 4, 4, 8, 4, 8, 4, 8, 2, 8, 4, 4, 8, 4, 1,
      8, 4, 4, 8, 4, 8, 4, 8, 2
    ];

    MIDI.loadPlugin({
      targetFormat: 'mp3',
      soundfontUrl: '/BachEditor/js/',
      instrument: 'marimba',
      callback: function() {
        MIDI.setVolume(0, 127);
        MIDI.programChange(0, 12);
        var cur = 0;
        $('textarea').keypress(function() {
          var delay = 1.3 / marioTimes[cur]; // play one note every quarter second
          var note = MIDI.keyToNote[marioKeys[cur]];
          MIDI.noteOn(0, note, velocity, 0);
          MIDI.noteOff(0, note, delay);
          if (cur >= 96) {
            cur = 0;
          } else {
            cur++;
          }
        });
      }
    });
  });*/
});
