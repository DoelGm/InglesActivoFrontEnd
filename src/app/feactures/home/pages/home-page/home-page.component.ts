import { Component } from '@angular/core';
import { NoticeCardComponent } from '../../components/notice-card/notice-card.component';
import {MenuAdminComponent} from "../../components/menu-admin/menu-admin.component";

@Component({
  selector: 'app-home-page',
  imports: [NoticeCardComponent, MenuAdminComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
