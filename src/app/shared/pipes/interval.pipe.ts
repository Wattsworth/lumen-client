import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'interval'
})
export class IntervalPipe implements PipeTransform {

  transform(value: number): any {
      let seconds = +value;
      console.log("got this: ", value)
      if(seconds<60)
        return Math.floor(seconds).toString()+"sec ";
      else{
        let minutes = seconds/60
        if(Math.floor(minutes)==minutes)
          return minutes.toString()+"min";
        else
          return (minutes).toFixed(1)+" min";
      }
  }

}
