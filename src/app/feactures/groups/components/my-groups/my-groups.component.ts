import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-groups',
  imports: [NgFor],
  templateUrl: './my-groups.component.html',
  styleUrl: './my-groups.component.css'
})
export class MyGroupsComponent {

    groups = [
    { id: 1, name: 'Grupo Angular', description: 'Frontend serio' },
    { id: 2, name: 'Grupo Backend', description: 'APIs y sufrimiento' }
  ];

  constructor(private router: Router) {}

  goToGroup(groupId: number) {
    this.router.navigate(['/groups', groupId]);
  }

}
