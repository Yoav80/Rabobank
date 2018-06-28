export function roundToTwo(num) {    
    return +(Math.round(Number(num + "e+2"))  + "e-2");
}