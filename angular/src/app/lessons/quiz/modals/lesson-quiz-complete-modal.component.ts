import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'lessonQuizCompleteModal',
  template: `
    <div class="modal-header">
        <h4 class="modal-title" id="modal-title">Quiz Results</h4>
        <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="dismiss()">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body" style="text-align: center">
        <p><strong>Here are you quiz results!</strong></p>

        <ng-template [ngIf]="passed == true">
            <div>
                <p><strong>You passed!</strong></p>
                <p>You currently have <span style="color:green">{{answers_correct}}</span> correct answers out of <span style="color:green">{{answers_count}}</span> possible.</p>
                <p><strong>Score:</strong>{{score}}</p>
                <br>
                <p>You have successfully unlocked the next lesson!</p>
            </div>
        </ng-template>

        <ng-template [ngIf]="passed == false">
            <div>
                <p><strong>You may want to practice some more.</strong></p>
                <p>You currently have <span style="color:red">{{answers_correct}}</span> correct answers out of <span style="color:red">{{answers_count}}</span> possible.</p>
                <p><strong>Score:</strong>{{score}}</p>
                <br>
                <p>You can try another quiz at any time, but you must pass if you want to unlock the next quiz</p>
            </div>
        </ng-template>

        <ng-template [ngIf]="passed == undefined">
            <p><strong>Waiting for results...</strong></p>
        </ng-template>
    </div>
    <div class="modal-footer">
        <button type="button" ngbAutofocus class="btn btn-danger" (click)="dismiss()" #closeBtn>Continue</button>
    </div>
  `,
})
export class LessonQuizCompleteModal {
    static score: number;
    static answers_count: number;
    static answers_correct: number;
    static passed: boolean;

    constructor(private modalService: NgbModal) {}

    dismiss() {
        this.modalService.dismissAll();
        window.location.href = "https://duohando.com/dashboard";
    }

    get answers_correct(): number {
        return LessonQuizCompleteModal.answers_correct;
    }

    get answers_count(): number {
        return LessonQuizCompleteModal.answers_count;
    }

    get passed(): boolean {
        return LessonQuizCompleteModal.passed;
    }

    get score(): number {
        return LessonQuizCompleteModal.score;
    }

    static submitScore(data: any) {
        console.log(data);
        this.score = data.score;
        this.answers_count = data.answers_count;
        this.answers_correct = data.answers_correct;
        this.passed = data.passed;
    }
}