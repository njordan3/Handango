import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { complete } from '../lesson-lecture';

@Component({
  selector: 'lessonLectureNextModal',
  template: `
    <div class="modal-header">
        <h4 class="modal-title" id="modal-title">Moving on to practice?</h4>
        <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="dismiss()">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body" style="text-align: center">
        <p><strong>Are you sure you are ready to practice what you've learned?</strong></p>
        <p>You can always come back to review this lecture again, but returning here from the practice session will undo any progress made in the practice.</p>
    </div>
    <div class="modal-footer">
        <button type="button" ngbAutofocus class="btn btn-danger" (click)="submit()" #closeBtn>Continue to Practice</button>
    </div>
  `,
})
export class LessonLectureNextModal {
    constructor(private modalService: NgbModal) {}

    dismiss() {
        this.modalService.dismissAll();
    }
    submit() {
        this.modalService.dismissAll();
        complete();
    }
}