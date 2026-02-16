import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService, Group } from '../../service/group.service';

@Component({
  selector: 'app-my-groups',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule],
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.css']
})
export class MyGroupsComponent implements OnInit {

  groups: Group[] = [];
  filteredGroups: Group[] = [];
  colors: string[] = []; // colores aleatorios para logos
  filterText = ''; // filtro por nombre

  constructor(private router: Router, private groupService: GroupService) {}

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getAllGroups().subscribe({
      next: (res) => {
        this.groups = res;
        this.filteredGroups = [...this.groups];
        // Generar color aleatorio para cada grupo
        this.colors = this.groups.map(() => this.getRandomColor());
      },
      error: (err) => {
        console.error('Error fetching groups:', err);
      }
    });
  }

  filterGroups() {
    const term = this.filterText.toLowerCase();
    this.filteredGroups = this.groups.filter(g => g.name.toLowerCase().includes(term));
  }

  goToGroup(groupId: number) {
    this.router.navigate(['/groups', groupId]);
  }

  getRandomColor(): string {
    const colors = [
      '#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#845EC2', 
      '#FF9671', '#008F7A', '#FFC75F', '#F9F871', '#D65DB1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase();
  }
}
