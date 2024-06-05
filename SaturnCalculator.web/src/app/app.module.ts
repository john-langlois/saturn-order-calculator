import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { ConfigService } from '../services/config.service';
import { AdminComponent } from './admin/admin.component';
import { ToastrModule } from 'ngx-toastr';
import { EditComponent } from './modal/edit/edit.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatatableComponent } from './datatable/datatable.component';
import { PaginationComponent } from './datatable/pagination/pagination.component';
import { UploadComponent } from './orders/upload.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { ViewOrderComponent } from './orders/view-order/view-order.component';
import { OrderFormComponent } from './orders/order-form/order-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    AdminComponent,
    EditComponent,
    DatatableComponent,
    PaginationComponent,
    SafeHtmlPipe,
    UploadComponent,
    ViewOrderComponent,
    OrderFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgbModule,
    CommonModule,
    FormsModule
  ],
  providers: [ConfigService , {
		provide: APP_INITIALIZER,
		useFactory: (configService: ConfigService) => configService.init(),
		deps: [ConfigService],
		multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
