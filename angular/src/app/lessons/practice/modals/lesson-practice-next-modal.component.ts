import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { sendComplete, getAnswers } from '../lesson-practice';

@Component({
  selector: 'LessonPracticeNextModal',
  template: `
    <div class="modal-header">
        <h4 class="modal-title" id="modal-title">Practice Results</h4>
        <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="dismiss()">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body" style="text-align: center">

        <ng-template [ngIf]="grade === 100.0">
            <div>
                <p><strong>100% of your answers correct!</strong></p>
                <p>You gave <span style="color:green">{{answers_correct}}</span> correct answers out of <span style="color:green">{{answers_count}}</span> possible.</p>
            </div>
        </ng-template>

        <ng-template [ngIf]="grade >= 70.0 && grade < 100.0">
            <div>
                <p><strong>You're almost there! You'll be ready for the quiz in no time!</strong></p>
                <p>You currently have <span style="color:blue">{{answers_correct}}</span> correct answers out of <span style="color:blue">{{answers_count}}</span> possible.</p>
            </div>
        </ng-template>

        <ng-template [ngIf]="grade < 70.0">
            <div>
                <p><strong>You may want to practice some more. Are you sure you want to continue to the quiz?</strong></p>
                <p>You currently have <span style="color:red">{{answers_correct}}</span> correct answers out of <span style="color:red">{{answers_count}}</span> possible.</p>
            </div>
        </ng-template>

    </div>
    <div class="modal-footer">
        <button type="button" ngbAutofocus class="btn btn-danger" (click)="submit()" #closeBtn>Continue to Quiz</button>
    </div>
  `,
})
export class LessonPracticeNextModal {
    static answers_correct: number = 0;
    static answers_count: number = 0;
    static grade: number = 0;

    constructor(private modalService: NgbModal) {}

    dismiss() {
        this.modalService.dismissAll();
    }
    submit() {
        this.modalService.dismissAll();
        sendComplete();
    }

    get answers_correct(): number {
        return LessonPracticeNextModal.answers_correct;
    }

    get answers_count(): number {
        return LessonPracticeNextModal.answers_count;
    }

    get grade(): number {
        return LessonPracticeNextModal.grade;
    }

    static updateResults() {
        let {answers_correct, answers_count} = getAnswers();
        this.answers_correct = answers_correct;
        this.answers_count = answers_count;
        this.grade = (answers_correct / answers_count)*100;
    }
}