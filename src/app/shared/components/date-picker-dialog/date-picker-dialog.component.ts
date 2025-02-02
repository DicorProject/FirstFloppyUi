import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-date-picker-dialog',
  templateUrl: './date-picker-dialog.component.html',
  styleUrl: './date-picker-dialog.component.scss'
})
export class DatePickerDialogComponent {
  selectedDay: string = 'Monday';
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  officeHours = ['08:00 AM - 10:00 AM', '09:00 AM - 11:00 AM', '12:00 PM - 02:00 PM', '03:00 PM - 04:00 PM', '05:00 PM - 07:00 PM'];
  currentDate:any
  selectedTime: string = '08:00 AM - 10:00 AM'
  minDate: Date = new Date();
  constructor(public dialogRef: MatDialogRef<DatePickerDialogComponent>) {}
  ngOnInit(){
  }

  selectDay(day: string) {
    this.selectedDay = day;
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close({ day: this.selectedDay, time: this.selectedTime , date:this.currentDate});
  }
}
