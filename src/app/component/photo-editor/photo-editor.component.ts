import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/models/photo';
import { FileUploader } from 'ng2-file-upload';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { AlertifyService } from 'src/app/service/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[];
  currentPhoto: Photo;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  constructor(private authService: AuthService, private userService: UserService, private alertifyService: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  deletePhoto(photo: Photo) {
    this.alertifyService.confirm('Are you sure you want to delete this photo? ', () => {
      this.userService.deletePhoto(+this.authService.decodedToken.nameid, photo.id)
      .subscribe(() => {
        this.alertifyService.success('Photo deleted successfully');
        this.photos = this.photos.filter(ph => ph.id !== photo.id );
      }, err => this.alertifyService.error('Deleting Photo Failed'));
    });
  }

  setMainPhoto(photo: Photo) {
    const userId = this.authService.decodedToken.nameid;
    this.userService.setMainPhoto(userId, photo.id).subscribe(() => {
      this.currentPhoto = this.photos.find(p => p.isMain === true);
      this.currentPhoto.isMain = false;
      photo.isMain = true;
      this.authService.changeMemberMainPhoto(photo.url);
      this.authService.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
      this.alertifyService.success('Photo set to main successfully');
    }, err => {
      this.alertifyService.error('Photo set failed');
    });
  }
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  initializeUploader() {
    this.uploader = new FileUploader({
      url: `http://localhost:5000/api/users/${this.authService.decodedToken.nameid}/photos`,
      isHTML5: true,
      authToken: `Bearer ${localStorage.getItem('token')}`,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = file => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res = <Photo>JSON.parse(response);
        const photo: Photo = {
          id: res.id,
          description: res.description,
          url: res.url,
          dateAdded: res.dateAdded,
          isMain: res.isMain
        };
        this.photos.push(photo);
        if (photo.isMain) {
          this.authService.changeMemberMainPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
        }
      }
    };
  }

}
