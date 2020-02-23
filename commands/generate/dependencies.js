const THREE_SOURCE_URI = 'https://github.com/mrdoob/three.js/archive/master.zip';
const DAT_GUI_SOURCE_URI = 'https://github.com/dataarts/dat.gui/archive/master.zip';
const STATS_SOURCE_URI = 'https://github.com/mrdoob/stats.js/archive/master.zip';

const Dependencies = {
    Three: {
        filename: 'three.mjs',
        uri: THREE_SOURCE_URI
    },
    DatGui: {
        filename:'dat.gui.mjs',
        uri:  DAT_GUI_SOURCE_URI
    },
    Stats: {
        filename: 'stats.mjs',
        uri: STATS_SOURCE_URI
    }
};

module.exports = {
    Dependencies
};