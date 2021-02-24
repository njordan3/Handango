import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { goBack } from '../lesson-lecture';

@Component({
  selector: 'lessonLecturePrevModal',
  template: `
    <div class="modal-header">
        <h4 class="modal-title" id="modal-title">Return to the Dashboard?</h4>
        <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="dismiss()">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body" style="text-align: center">
        <p><strong>Are you sure you are ready to go back to your Dashboard?</strong></p>
        <p>You can always come back to review this lecture again.</p>
    </div>
    <div class="modal-footer">
        <button type="button" ngbAutofocus class="btn btn-danger" (click)="submit()" #closeBtn>Go back to the Dashboard</button>
    </div>
  `,
})
export class LessonLecturePrevModal {
    constructor(private modalService: NgbModal) {}

    dismiss() {
        this.modalService.dismissAll();
    }
    submit() {
        this.modalService.dismissAll();
        goBack();
    }
}