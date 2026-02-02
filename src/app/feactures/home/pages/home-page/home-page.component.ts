import { Component } from '@angular/core';
import { NoticeCardComponent } from '../../components/notice-card/notice-card.component';
import { MenuAdminComponent } from "../../../admin/components/menu-admin/menu-admin.component";

@Component({
  selector: 'app-home-page',
  imports: [NoticeCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
