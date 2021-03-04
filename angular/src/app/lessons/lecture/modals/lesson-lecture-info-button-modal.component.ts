import { Component, PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getButtonInfo } from '../lesson-lecture';


@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
@Component({
  selector: 'lessonLectureInfoButtontModal',
  template: `
    <div class="modal-header" style="text-align: center">
        <h4 class="modal-title" id="modal-title"><strong>{{button.phrase}}</strong></h4>
        <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="dismiss()">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body" style="text-align: center">

        <ng-template [ngIf]="button.video">
            <iframe width="500" height="315" [src]="button.video | safe" frameborder="0" allowfullscreen></iframe>
            <br>
        </ng-template>

        <ng-template [ngIf]="button.images.length === 1">
            <img src={{button.images[0]}} style="border-radius: 50%">
        </ng-template>

        <ng-template [ngIf]="button.images.length === 2">
            <img src={{button.images[0]}} style="border-radius: 50%">
            <ng-template [ngIf]="button.vertical">
                <br>
            </ng-template>
            <img src={{button.images[1]}} style="border-radius: 50%">
        </ng-template>

        <p><strong>Instructions and Tips:</strong></p>
        <p><strong>{{button.phrase}}: </strong>{{button.caption}}</p>
    </div>
    <div class="modal-footer">
        <button type="button" ngbAutofocus class="btn btn-danger" (click)="submit()" #closeBtn>Got it</button>
    </div>
  `,
})
export class LessonLectureInfoButtonModal {
    button: any;
    //any videos in button must use embed instead of watch
    constructor(private modalService: NgbModal) {
        this.button = getButtonInfo();
    }

    dismiss() {
        this.modalService.dismissAll();
    }
    submit() {
        this.modalService.dismissAll();
    }
}