
'use client';

import { useEffect } from 'react';
import { GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

export function FirebaseUI() {
  useEffect(() => {
    // This component is no longer used, but is kept to prevent breaking imports.
    // The login logic has been moved to /src/app/login/page.tsx
  }, []);

  return <div id="firebaseui-auth-container" />;
}
