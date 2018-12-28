import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxGalleryModule } from 'ngx-gallery';

import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { LoginComponent } from './component/login/login.component';
import { HomeComponent } from './component/home/home.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './service/auth.service';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { RegisterComponent } from './component/register/register.component';
import { AlertifyService } from './service/alertify.service';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { AuthGuard } from './guard/auth.guard';
import { MatchesComponent } from './component/matches/matches.component';
import { MembersListComponent } from './component/members/members-list/members-list.component';
import { MessageComponent } from './component/message/message.component';
import { UserService } from './service/user.service';
import { MemberCardComponent } from './component/members/member-card/member-card.component';
import { JwtModule } from '@auth0/angular-jwt';
import { MemberDetailComponent } from './component/members/member-detail/member-detail.component';
import { MemberDetailResolver } from './resolvers/member.detail.resolvers';
import { MemberEditComponent } from './component/members/member-edit/member-edit.component';
import { PreventUnSavedChanges } from './guard/prevent.unsaved.changes';

export function tokenGetter() {
  return localStorage.getItem('token');
}
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    HomeComponent,
    NotFoundComponent,
    RegisterComponent,
    MatchesComponent,
    MembersListComponent,
    MessageComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberEditComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxGalleryModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        blacklistedRoutes: ['localhost:5000/api/auth'],
        whitelistedDomains: ['localhost:5000']
      }
    }),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot()
  ],
  providers: [AuthService, AlertifyService, AuthGuard, UserService, MemberDetailResolver, PreventUnSavedChanges],
  bootstrap: [AppComponent]
})
export class AppModule { }
