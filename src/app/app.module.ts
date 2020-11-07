import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CreateEmployeeComponent } from './employee/create-employee.component';
import { ListEmployeesComponent } from './employee/list-employees.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from './employee/employee.service';

@NgModule({
  declarations: [AppComponent, CreateEmployeeComponent, ListEmployeesComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [EmployeeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
