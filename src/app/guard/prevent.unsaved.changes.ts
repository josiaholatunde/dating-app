import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../component/members/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnSavedChanges implements CanDeactivate<MemberEditComponent> {
  canDeactivate(component: MemberEditComponent) {
    if (component.editForm.dirty) {
      return confirm('Are you sure you want to leave this page? Any Unsaved changes would be lost');
    }
    return true;
  }
}
