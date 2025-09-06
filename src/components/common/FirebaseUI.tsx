
'use client';

import { useEffect } from 'react';
import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

export function FirebaseUI() {
  useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    
    const uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        EmailAuthProvider.PROVIDER_ID,
      ],
      // Other config options...
    };

    ui.start('#firebaseui-auth-container', uiConfig);

  }, []);

  return <div id="firebaseui-auth-container" />;
}
