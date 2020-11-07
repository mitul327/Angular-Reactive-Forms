import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css'],
})
export class ListEmployeesComponent implements OnInit {
  public employees: IEmployee[];
  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(
      (employeeList) => (this.employees = employeeList),
      (err) => console.log(err)
    );
  }

  public editButtonClick(employeeId: number): void {
    this.router.navigate(['/edit', employeeId]);
  }
}
