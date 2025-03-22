import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProjectserviceService } from '../core/services/projectservice.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent {
  @ViewChild('skillsList', { static: false })
  skillsList!: ElementRef<HTMLUListElement>;

  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  skills: { skill: string; imageUrl: string }[] = [];
  projectDetails: any = {};
  difficulty = '';

  constructor(
    private project: ProjectserviceService,
    private location: Location
  ) {
    this.project.currentProject.subscribe((data) => {
      this.projectDetails = data;
      this.skills = data.techStack || [];
      this.difficulty = data.difficulty;
      console.log(this.skills);
    });
  }

  ngAfterViewInit() {
    const skillsElement = this.skillsList.nativeElement;

    // Add mouse event listeners
    skillsElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    skillsElement.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    skillsElement.addEventListener('mouseup', this.onMouseUp.bind(this));
    skillsElement.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.pageX - this.skillsList.nativeElement.offsetLeft;
    this.scrollLeft = this.skillsList.nativeElement.scrollLeft;
  }

  onMouseLeave(): void {
    this.isDragging = false;
  }

  onMouseUp(): void {
    this.isDragging = false;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - this.skillsList.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2; // Adjust the multiplier for speed
    this.skillsList.nativeElement.scrollLeft = this.scrollLeft - walk;
  }
}
