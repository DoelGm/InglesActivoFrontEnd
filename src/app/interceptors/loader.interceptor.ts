import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loader: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    this.loader.show();

    return next.handle(req).pipe(
      finalize(() => this.loader.hide())
    );
  }
}