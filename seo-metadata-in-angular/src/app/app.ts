import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [SeoService]
})
export class App implements OnInit {
  protected readonly title = signal('seo-metadata-in-angular');

  constructor(private seo: SeoService) {}

  ngOnInit() {
    this.seo.generateTags({
      title: 'Angular App',
      description: 'The main angular app entry point optimized for SEO.',
      url: 'https://example.com'
    });
    
    this.seo.setJsonLd({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Angular App",
      "url": "https://example.com"
    });
  }
}
