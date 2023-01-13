import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanesFunctions {

  constructor() { }

  removeAccents(string:string):string {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  negativeToPositive(number:number):number{
    return number < 0 ? number * -1 : number
  }

  transformStringRoman(string:string):string{
    let separateString = string.split(" ")
    const nuevoSeparate = separateString.map(str => {
      if(this.includesRoman(str)){
        return this.romanToInt(str).toString()
      }
      return str
    })
    return nuevoSeparate.join(' ')
  }

  includesRoman(string:string):boolean {
    const values = ['I','II','III','IV','V','VI','VII','VIII']
    return values.some(value => value === string)
  }


  romanToInt(string:string) {
    const values = new Map([
      ['I', 1],
      ['V', 5],
      ['X', 10]
    ]);


    let result = 0,
    current, previous = 0;
    for (const char of string.split("").reverse()) {
      current = values.get(char);
      if(current){
        if (current >= previous) {
          result += current;
        } else {
          result -= current;
        }
        previous = current;
      }

    }
    return result;
  }
}
