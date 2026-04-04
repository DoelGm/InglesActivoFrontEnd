import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderService } from './services/loader.service';
import { LoaderComponent } from './shared/loader/loader.component';

//declare var google: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'InglesActivoFrontEnd';
  constructor(public loaderService: LoaderService) {}

  ngOnInit(): void {
    
  }

  // ngOnInit(): void {
  //   this.cargarTraductor();
  // }

  // cargarTraductor() {
  //   const script = document.createElement('script');
  //   script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  //   script.async = true;
  //   document.body.appendChild(script);

  //   (window as any).googleTranslateElementInit = () => {
  //     new google.translate.TranslateElement(
  //       {
  //         pageLanguage: 'en', // idioma base de tu web
  //         includedLanguages: 'en,es,fr,it,pt', // idiomas que quieres
  //       },
  //       'google_translate_element'
  //     );
  //   };
  // }

}