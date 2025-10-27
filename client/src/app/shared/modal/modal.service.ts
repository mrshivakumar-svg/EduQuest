import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ModalType = 'info' | 'success' | 'error' | 'confirm';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalData = new BehaviorSubject<{
    title: string;
    message: string;
    type: ModalType;
    onConfirm?: () => void;
  } | null>(null);

  modalData$ = this.modalData.asObservable();

  open(title: string, message: string, type: ModalType = 'info', onConfirm?: () => void) {
    this.modalData.next({ title, message, type, onConfirm });
  }

  close() {
    this.modalData.next(null);
  }
}
