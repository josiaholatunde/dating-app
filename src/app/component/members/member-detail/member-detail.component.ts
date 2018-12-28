import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/service/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/models/user';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  providers: [UserService, AlertifyService]
})
export class MemberDetailComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  user: User;
  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    this.galleryOptions = [
      {
          width: '500px',
          height: '500px',
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide
      }
    ];
    this.galleryImages = this.getImages();
  }

  getImages() {
    const imgUrls = [];
    this.user.photos.forEach(photo => {
      imgUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url
      });
    });
    return imgUrls;
  }
  loadUser() {
    this.userService.getUser(+this.route.snapshot.params['id']).subscribe(user => {
      this.user = user;
    }, err => this.alertify.error(err));
  }

}
