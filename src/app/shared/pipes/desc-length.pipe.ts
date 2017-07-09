import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'descLength'})
export class DescLengthPipe implements PipeTransform {
    public transform(input: string, length: number = 300): string {
        if (!input) {
            return '';
        } else {
            return input.substr(0, length) + ((input.length < length) ? '' : '...');
        }
    }

}
