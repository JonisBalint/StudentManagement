import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);
  searchTerm: string = '';

  onSearch() {
    // Ha a felhasználó gépel, átirányítjuk a Students oldalra a keresési paraméterrel
    if (this.searchTerm.trim()) {
      this.router.navigate(['/students'], { queryParams: { q: this.searchTerm } });
    }
  }
}