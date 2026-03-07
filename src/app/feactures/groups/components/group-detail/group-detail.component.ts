import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnrollmentService } from '../../service/enrollment/enrollment.service';
import { UsersService } from '../../../admin/services/users.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-detail',
  imports: [NgFor, NgIf, FormsModule, NgClass],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.css'
})
export class GroupDetailComponent implements OnInit {

  groupId!: number;

  posts: any[] = [];

  students:any[] = [];
  availableStudents:any[] = [];
  isAdmin = false;
  selectedStudents:number[] = [];
  studentsToAdd:number[] = [];

  studentSearch = '';

  studentToDelete:any = null;

  deleteMultiple=false;

   message: string = '';
  messageType: 'success' | 'danger' | '' = '';

  constructor(
    private route: ActivatedRoute,
    private enrrolmentService: EnrollmentService,
    private usersService: UsersService
  ) {}

  ngOnInit(){

  const role = localStorage.getItem('role');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id;

  this.groupId = Number(this.route.snapshot.paramMap.get('id'));

  this.isAdmin = role === 'admin'|| role === 'teacher';

  if (role === 'admin'|| role === 'teacher') {
    this.loadGroupStudents();
    this.loadStudents();
  } else if (role === 'student') {
    this.loadGroupStudents();
  }

  this.posts=[
    {title:'Bienvenidos',content:'Primera publicación'},
    {title:'Aviso',content:'Clase mañana'}
  ];

  }


  loadGroupStudents(){

    this.enrrolmentService
      .getEnrollmentsByGroupId(this.groupId)
      .subscribe(enrollments=>{

        this.students = enrollments.map((e:any)=>({

          enrollmentId:e.id,

          fullName:`${e.student.user.first_name} ${e.student.user.last_name}`

        }));

      });

  }

  loadStudents(){

    this.usersService.getAllStudents().subscribe(students=>{

      this.availableStudents = students.map((s:any)=>({

        student_id:s.id,

        displayName:`${s.user.first_name} ${s.user.last_name}`

      }));

    });

  }

  filteredStudents(){

    const search=this.studentSearch.toLowerCase();

    return this.availableStudents.filter(s=>
      s.displayName.toLowerCase().includes(search)
    );

  }

  toggleStudentToAdd(id:number){

    if(this.studentsToAdd.includes(id)){

      this.studentsToAdd =
      this.studentsToAdd.filter(x=>x!==id);

    }else{

      this.studentsToAdd.push(id);

    }

  }

  addStudents(){

    this.studentsToAdd.forEach(id=>{

      this.enrrolmentService
      .enrollStudent(this.groupId,id)
      .subscribe(()=>{

        this.loadGroupStudents();

      });

    });

    this.studentsToAdd=[];

    this.showMessage('Alumnos agregados correctamente', 'success');

  }

  toggleSelection(id:number){

    if(this.selectedStudents.includes(id)){

      this.selectedStudents =
      this.selectedStudents.filter(x=>x!==id);

    }else{

      this.selectedStudents.push(id);

    }

  }

  toggleSelectAll(event:any){

    if(event.target.checked){

      this.selectedStudents =
      this.students.map(s=>s.enrollmentId);

    }else{

      this.selectedStudents=[];

    }

  }

  isSelected(id:number){

    return this.selectedStudents.includes(id);

  }


  openDeleteModal(student:any){

    this.studentToDelete = student;

  }

  closeDeleteModal(){

    this.studentToDelete=null;

  }

  deleteConfirmed(){

    this.enrrolmentService
    .deleteEnrollment(this.studentToDelete.enrollmentId)
    .subscribe(()=>{

      this.loadGroupStudents();

      this.showMessage('Alumno eliminado correctamente', 'danger');

      this.closeDeleteModal();

    });

  }


  openDeleteMultiple(){

    this.deleteMultiple=true;

  }

  closeDeleteMultiple(){

    this.deleteMultiple=false;

  }

  deleteSelected(){

    this.selectedStudents.forEach(id=>{

      this.enrrolmentService
      .deleteEnrollment(id)
      .subscribe(()=>{

        this.loadGroupStudents();

      });

    });

    this.showMessage('Alumnos eliminados correctamente', 'danger');

    this.selectedStudents=[];

    this.closeDeleteMultiple();

  }

  showMessage(text: string, type: 'success' | 'danger') {
    this.message = text;
    this.messageType = type;

    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 4000);
  }

}