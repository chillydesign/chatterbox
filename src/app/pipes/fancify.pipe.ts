import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fancify'
})
export class FancifyPipe implements PipeTransform {




  transform(text: string): string {


    // const asterisks = /\*(\S([^*]*?\S)?)\*/g;
    // while (text.match(asterisks)) {
    //   const asterisk_matches = text.match(asterisks);
    //   asterisk_matches.forEach((match) => {
    //     const newText = match.split('*');
    //     text = text.replace(match, `<strong style="font-weight:bold">${newText[1]}</strong>`);
    //   });
    // }
    // const underscores = /\_(\S([^_]*?\S)?)\_/g;
    // while (text.match(underscores)) {
    //   const underscore_matches = text.match(underscores);
    //   underscore_matches.forEach((match) => {
    //     const newText = match.split('_');
    //     text = text.replace(match, `<em style="font-style:italic">${newText[1]}</em>`);
    //   });
    // }



    // add br tags for each new line char
    const text_with_lines = text.replace(new RegExp('\n', 'g'), "<br />")
    return text_with_lines;

  }




}
