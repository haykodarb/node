module.exports = function randomize(len) {
    let serie = '';
    while (serie.length < len) {
        let x = Math.floor(Math.random() * 74) + 48;
        if (x <= 57 || (x >= 65 && x <= 90) || x >= 97) {
            serie += String.fromCharCode(x);
        }
    }
    return serie;
};
