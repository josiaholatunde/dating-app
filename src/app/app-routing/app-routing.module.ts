import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../component/login/login.component';
import { HomeComponent } from '../component/home/home.component';
import { NotFoundComponent } from '../component/not-found/not-found.component';
import { MembersListComponent } from '../component/members/members-list/members-list.component';
import { MessageComponent } from '../component/message/message.component';
import { AuthGuard } from '../guard/auth.guard';
import { MatchesComponent } from '../component/matches/matches.component';
import { MemberDetailComponent } from '../component/members/member-detail/member-detail.component';
import { MemberDetailResolver } from '../resolvers/member.detail.resolvers';
import { MemberEditComponent } from '../component/members/member-edit/member-edit.component';
import { MemberEditResolver } from '../resolvers/member.edit.resolver';
import { PreventUnSavedChanges } from '../guard/prevent.unsaved.changes';
import { MemberListResolver } from '../resolvers/member.list.resolver';
import { ListComponent } from '../component/list/list.component';
import { ListsResolver } from '../resolvers/lists.resolver';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'matches', component: MatchesComponent, canActivate: [ AuthGuard ] },
  { path: 'lists', component: ListComponent, canActivate: [ AuthGuard ], resolve: { user: ListsResolver } },
  { path: 'members', component: MembersListComponent, canActivate: [ AuthGuard ], resolve: { user: MemberListResolver } },
  { path: 'member/edit', component: MemberEditComponent, canActivate: [ AuthGuard ], canDeactivate: [PreventUnSavedChanges],
   resolve: { user: MemberEditResolver} },
  { path: 'members/:id', component: MemberDetailComponent, canActivate: [ AuthGuard ], resolve: { user: MemberDetailResolver} },
  { path: 'messages', component: MessageComponent, canActivate: [ AuthGuard ]  },
  { path: 'home', component: HomeComponent },
  { path: '**', component: NotFoundComponent },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
