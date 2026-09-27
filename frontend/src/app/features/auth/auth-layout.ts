import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

// both auth steps sit in this, otherwise the form is a small card floating in a lot of nothing
@Component({
  selector: 'app-auth-layout',
  imports: [MatIconModule],
  template: `
    <div class="shell">
      <aside class="brand">
        <div class="brand-inner">
          <div class="wordmark">Relish</div>
          <p class="tagline">Good food from the kitchens around you, brought over while it's still hot.</p>

          <ul class="points">
            <li>
              <mat-icon>mail</mat-icon>
              <div>
                <strong>No passwords, ever</strong>
                <span>We email you a six digit code instead.</span>
              </div>
            </li>
            <li>
              <mat-icon>restaurant</mat-icon>
              <div>
                <strong>Local kitchens</strong>
                <span>Independent restaurants, not a chain in sight.</span>
              </div>
            </li>
            <li>
              <mat-icon>local_shipping</mat-icon>
              <div>
                <strong>Watch it come</strong>
                <span>Every order tracked from the kitchen to your door.</span>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      <main class="panel">
        <div class="panel-inner">
          <ng-content></ng-content>
        </div>
      </main>
    </div>
  `,
  styles: `
    .shell {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1.05fr 1fr;
    }
    .brand {
      background: linear-gradient(140deg, var(--mat-sys-primary), var(--mat-sys-tertiary));
      color: #fff;
      display: flex;
      align-items: center;
      padding: 56px 52px;
    }
    .brand-inner {
      max-width: 430px;
    }
    .wordmark {
      font-size: 2.6rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 10px;
    }
    .tagline {
      font-size: 1.05rem;
      line-height: 1.55;
      opacity: 0.94;
      margin: 0 0 36px;
    }
    .points {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .points li {
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }
    .points mat-icon {
      flex-shrink: 0;
      opacity: 0.9;
    }
    .points strong {
      display: block;
      font-size: 0.95rem;
      font-weight: 600;
    }
    .points span {
      font-size: 0.87rem;
      opacity: 0.88;
    }

    .panel {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 24px;
      background: var(--mat-sys-surface);
    }
    .panel-inner {
      width: 100%;
      max-width: 380px;
    }

    @media (max-width: 900px) {
      .shell {
        grid-template-columns: 1fr;
      }
      .brand {
        padding: 34px 24px 30px;
      }
      .brand-inner {
        max-width: none;
      }
      .wordmark {
        font-size: 2rem;
      }
      .tagline {
        margin-bottom: 0;
        font-size: 0.95rem;
      }
      /* the selling points are the first thing to go, the form matters more on a phone */
      .points {
        display: none;
      }
      .panel {
        padding: 32px 20px 48px;
        align-items: flex-start;
      }
    }
  `,
})
export class AuthLayout {}
