import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppButtonComponent } from '@shared/components/ui/button/button.component';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, AppButtonComponent],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent {
  private readonly router = inject(Router);

  goBack(): void {
    this.router.navigate(['/']);
  }

  startJourney(): void {
    this.router.navigate(['/auth/login']);
  }
}
