import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone:true,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports:[CommonModule]
})
export class FooterComponent {

}
