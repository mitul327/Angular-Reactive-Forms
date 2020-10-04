import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],
})
export class CreateEmployeeComponent implements OnInit {
  public employeeForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.employeeForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
      email: [''],
      skills: this.fb.group({
        skillName: ['Angular'],
        experienceInYears: [''],
        proficiency: ['beginner'],
      }),
    });

    this.employeeForm.get('fullName').valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  public onSubmit(): void {
    console.log(this.employeeForm);
  }

  public onLoadDataClick(): void {
    this.employeeForm.patchValue({
      fullName: 'Mitul Panchal',
      email: 'mitul327@rediffmail.com',
      /*   skills: {
          skillName: 'Angular',
          experienceInYears: 8,
          proficiency: 'intermediate',
        }, */
    });
  }
}
