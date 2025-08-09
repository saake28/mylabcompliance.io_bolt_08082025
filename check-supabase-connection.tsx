import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export function CheckSupabaseConnection() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        // Test basic connection
        const { data, error } = await supabase.from('users').select('count(*)', { count: 'exact', head: true });
        
        if (error) {
          console.error('Connection error:', error);
          setConnectionStatus('error');
          setErrorMessage(error.message);
        } else {
          console.log('Connection successful');
          setConnectionStatus('connected');
        }
        
        // Check auth status
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Auth error:', sessionError);
          setAuthStatus('unauthenticated');
        } else if (session) {
          console.log('Authenticated:', session.user);
          setAuthStatus('authenticated');
          setUser(session.user);
        } else {
          console.log('Not authenticated');
          setAuthStatus('unauthenticated');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setConnectionStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
      }
    }
    
    checkConnection();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="space-y-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span>
              {connectionStatus === 'connected' ? 'Connected to Supabase' : 
               connectionStatus === 'error' ? 'Connection Error' : 'Checking connection...'}
            </span>
          </div>
          {errorMessage && (
            <p className="mt-2 text-red-600 text-sm">{errorMessage}</p>
          )}
        </div>
        
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              authStatus === 'authenticated' ? 'bg-green-500' : 
              authStatus === 'unauthenticated' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span>
              {authStatus === 'authenticated' ? 'Authenticated' : 
               authStatus === 'unauthenticated' ? 'Not Authenticated' : 'Checking authentication...'}
            </span>
          </div>
          {user && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <h3 className="font-medium mb-2">User Information</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Last Sign In:</strong> {new Date(user.last_sign_in_at).toLocaleString()}</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Test Auth Request</h2>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={async () => {
              try {
                const { data, error } = await supabase.auth.refreshSession();
                if (error) {
                  alert(`Auth refresh failed: ${error.message}`);
                } else {
                  alert('Auth refresh successful');
                  if (data.session) {
                    setUser(data.session.user);
                    setAuthStatus('authenticated');
                  }
                }
              } catch (err) {
                alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
              }
            }}
          >
            Test Auth Refresh
          </button>
        </div>
      </div>
    </div>
  );
}