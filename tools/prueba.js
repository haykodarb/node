function randomize (len) {
    let serie = '';
    while (serie.length < len) {
        let x = Math.floor(Math.random() * 74)+48;
        if(x <= 57 || x >= 65 && x <= 90 || x >= 97 ) {
            serie += String.fromCharCode(x);  
        }
    }
    return serie;}

let serie;
let p = 0;
while(!serie) {
    if(p === 4) {
        serie = randomize(8);       
    }
    p++;
    console.log(p);
}                

console.log(serie);