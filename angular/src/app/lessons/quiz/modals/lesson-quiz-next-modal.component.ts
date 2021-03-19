import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { sendComplete, getAnswers, startTimer, callStop } from '../lesson-quiz';
import { LessonQuizCompleteModal } from './lesson-quiz-complete-modal.component';

@Component({
  selector: 'lessonQuizNextModal',
  template: `
    <div class="modal-header">
        <h4 class="modal-title" id="modal-title">Quiz Submission</h4>
        <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="dismiss()">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body" style="text-align: center">
        <p><strong>Are you sure you are ready to submit your quiz?</strong></p>
        <p>If you still have time, feel free to review your answers before you submit. When the timer runs out, your quiz will be submitted automatically.</p>
    </div>
    <div class="modal-footer">
        <button type="button" ngbAutofocus class="btn btn-danger" (click)="submit()" #closeBtn>Submit Quiz</button>
    </div>
  `,
})
export class LessonQuizNextModal {
    static answers_correct: number = 0;
    static answers_count: number = 0;
    static grade: number = 0;

    constructor(private modalService: NgbModal) {}

    dismiss() {
        this.modalService.dismissAll();
        startTimer();
    }
    submit() {
        this.modalService.dismissAll();
        callStop();
        sendComplete();
        this.modalService.open(LessonQuizCompleteModal, { centered: true, animation: true, keyboard: false, backdrop: 'static' });
    }

    static updateResults() {
        let {answers_correct, answers_count} = getAnswers();
        this.answers_correct = answers_correct;
        this.answers_count = answers_count;
        this.grade = (answers_correct / answers_count)*100;
    }
}