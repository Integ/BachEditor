console.log("Bach's Editor is loaded...");
var ID = 'lcemhgomgkipbfiedfnahialngolefkg';
// dmfihpamcjoigbeojgibmnpidflfagck
MIDI.loadPlugin({
    soundfontUrl: "chrome-extension://" + ID + "/MIDI.js/soundfont/",
    instrument: "acoustic_grand_piano", // or 1 (default)
    callback: function() {
        var delay = 0; // play one note every quarter second
        var velocity = 127; // how hard the note hits play the note
        MIDI.setVolume(0, 127);
        $('textarea, input').keydown(function(e) {
            MIDI.noteOn(0, e.which, velocity, delay);
            MIDI.noteOff(0, e.which, delay + 0.75);
            console.log("Bach's Editor: ", e.which);
        });
    }
});
