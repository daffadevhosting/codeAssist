"use client";

import { useState, useEffect } from 'react';

const useLicenseCheck = () => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const appId = document.querySelector('meta[property="appId"]');
    const licenseElement = document.getElementById('appId');

    if (!appId || !licenseElement) {
      setIsLocked(true);
      return;
    }

    const encodedLicense = appId.getAttribute('content');
    if (!encodedLicense) {
      setIsLocked(true);
      return;
    }

    const decodedLicense = atob(encodedLicense);
    const footerText = licenseElement.textContent;

    if (decodedLicense !== footerText) {
      setIsLocked(true);
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'characterData' ||
          mutation.type === 'childList'
        ) {
          if (licenseElement.textContent !== decodedLicense) {
            setIsLocked(true);
            observer.disconnect();
          }
        }
      });
    });

    observer.observe(licenseElement, {
      subtree: true,
      characterData: true,
      childList: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return isLocked;
};

export default useLicenseCheck;