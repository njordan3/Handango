import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { goBack } from '../lesson-quiz';

@Component({
  selector: 'lessonQuizPrevModal',
  template: `
    <div class="modal-header">
        <h4 class="modal-title" id="modal-title">Cancel Quiz</h4>
        <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="dismiss()">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body" style="text-align: center">
        <p><strong>Are you sure you want to leave the quiz?</strong></p>
        <p>If you need more review you can always go back to the lecture and practice, but your current quiz progress will be lost.</p>
    </div>
    <div class="modal-footer">
        <button type="button" ngbAutofocus class="btn btn-danger" (click)="submit()" #closeBtn>Go back to practice</button>
    </div>
  `,
})
export class LessonQuizPrevModal {
    constructor(private modalService: NgbModal) {}

    dismiss() {
        this.modalService.dismissAll();
    }
    submit() {
        this.modalService.dismissAll();
        goBack();
    }
}