import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(date: Date): string {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 10) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}
