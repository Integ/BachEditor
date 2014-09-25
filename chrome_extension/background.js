console.log("Bach's Editor is loaded...");

MIDI.loadPlugin({
    soundfontUrl: "chrome-extension://dmfihpamcjoigbeojgibmnpidflfagck/MIDI.js/soundfont/",
    instrument: "acoustic_grand_piano", // or 1 (default)
    callback: function() {
        var delay = 0; // play one note every quarter second
        var note = 50; // the MIDI note
        var velocity = 127; // how hard the note hits play the note
        MIDI.setVolume(0, 127);
        MIDI.noteOn(0, note, velocity, delay);
        MIDI.noteOff(0, note, delay + 0.75);
        $('textarea').keydown(function(e) {
            MIDI.noteOn(0, e.which, velocity, delay);
            MIDI.noteOff(0, e.which, delay + 0.75);
            console.log("Bach's Editor: ", e.which);
        });
    }
});
