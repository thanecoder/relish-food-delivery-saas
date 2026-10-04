import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
})
export class Avatar {
  name = input.required<string>();
  size = input(36);
  square = input(false);

  // customers sign up with just an email so name is often the email itself, use the part before the @
  initials = computed(() => {
    const raw = this.name().trim();
    const base = raw.includes('@') ? raw.split('@')[0] : raw;
    const parts = base.split(/[\s._-]+/).filter((p) => /^[\p{L}\p{N}]/u.test(p));
    if (parts.length === 0) {
      return '?';
    }
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  });

  hue = computed(() => {
    let h = 0;
    for (const ch of this.name().toLowerCase()) {
      h = (h * 31 + ch.charCodeAt(0)) % 360;
    }
    return h;
  });
}
