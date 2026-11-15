'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function VisitorTracker() {
  const pathname = usePathname();
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    // 1. Exclude Admin routes and API
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    // 2. Prevent duplicate tracking within same component mount / React 18 strict mode double-effect
    if (hasTrackedRef.current) {
      return;
    }
    hasTrackedRef.current = true;

    try {
      // 3. Prevent duplicate calls within 15 seconds in same session navigation
      const lastTrackKey = 'jjmi_last_track_' + pathname;
      const lastTrackTime = sessionStorage.getItem(lastTrackKey);
      const now = Date.now();
      if (lastTrackTime && now - parseInt(lastTrackTime, 10) < 15000) {
        return;
      }
      sessionStorage.setItem(lastTrackKey, now.toString());

      // 4. Retrieve or generate privacy-conscious anonymous visitor ID
      let visitorId = localStorage.getItem('jjmi_vid');
      if (!visitorId) {
        const randomPart = Math.random().toString(36).substring(2, 10);
        const timePart = Date.now().toString(36);
        visitorId = `v_${randomPart}_${timePart}`;
        localStorage.setItem('jjmi_vid', visitorId);
      }

      // 5. Dispatch lightweight non-blocking payload
      const payload = {
        visitorId,
        pageUrl: window.location.pathname + window.location.search,
        referrer: document.referrer || '',
        screenWidth: window.innerWidth || window.screen.width,
      };

      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/api/track', blob);
      } else {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Fail completely silent - never interrupts devotee flow
    }
  }, [pathname]);

  return null;
}
