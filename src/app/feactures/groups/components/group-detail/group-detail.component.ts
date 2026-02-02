import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-detail',
  imports: [NgFor],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.css'
})
export class GroupDetailComponent implements OnInit {
  groupId!: number;
  posts: { title: string; content: string }[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));

    // Simulación de publicaciones
    this.posts = [
      { title: 'Bienvenidos', content: 'Primera publicación' },
      { title: 'Aviso', content: 'Clase mañana' }
    ];
  }
}