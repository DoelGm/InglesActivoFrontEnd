import { Component } from '@angular/core';
import { MyGroupsComponent } from '../../components/my-groups/my-groups.component';

@Component({
  selector: 'app-group-page',
  imports: [MyGroupsComponent],
  template: `
    <app-my-groups></app-my-groups>
  `,
  styles: ``
})
export class GroupPageComponent {

}
