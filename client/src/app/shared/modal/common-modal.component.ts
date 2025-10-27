import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalService, ModalType } from './modal.service';

@Component({
  selector: 'app-common-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './common-modal.component.html',
  styleUrls: ['./common-modal.component.scss']
})
// common-modal.component.ts
export class CommonModalComponent implements OnDestroy {
  show = false;
  title = '';
  message = '';
  type: ModalType = 'info';
  private onConfirmCallback?: () => void;
  private sub: Subscription;

  constructor(private modalService: ModalService) {
    this.sub = this.modalService.modalData$.subscribe(data => {
      if (data) {
        this.title = data.title;
        this.message = data.message;
        this.type = data.type;
        this.onConfirmCallback = data.onConfirm;
        this.show = true;

        // Auto close for non-confirm types
        if (data.type !== 'confirm') {
          setTimeout(() => this.close(), 10000);
        }
      } else {
        this.show = false;
      }
    });
  }

  confirm() {
    this.onConfirmCallback?.();
    this.close();
  }

  close() {
    this.show = false;
    this.modalService.close();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

