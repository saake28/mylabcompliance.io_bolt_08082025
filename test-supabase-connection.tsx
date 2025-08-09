import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export function TestSupabaseConnection() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [user, setUser] = useState<any>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    try {
      console.log('Testing Supabase connection...');
      
      // Test basic connection
      const { data, error } = await supabase.from('users').select('count(*)', { count: 'exact', head: true });
      
      if (error) {
        console.error('Connection error:', error);
        setConnectionStatus('error');
        setErrorMessage(error.message);
      } else {
        console.log('Connection successful:', data);
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

  async function testAuthRequest() {
    try {
      setTestResult('Testing auth request...');
      
      // Try to refresh the session
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Auth refresh error:', error);
        setTestResult(`Auth refresh failed: ${error.message}`);
      } else if (data.session) {
        console.log('Auth refresh successful:', data.session);
        setTestResult('Auth refresh successful!');
        setUser(data.session.user);
        setAuthStatus('authenticated');
      } else {
        setTestResult('Auth refresh returned no session');
      }
    } catch (err) {
      console.error('Auth test error:', err);
      setTestResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  async function testTableCreation() {
    try {
      setTestResult('Testing table creation...');
      
      // Try to create a simple test table
      const { error } = await supabase
        .from('test_connection_table')
        .insert([{ name: 'Test', created_at: new Date().toISOString() }]);
      
      if (error) {
        if (error.code === '42P01') { // Table doesn't exist
          setTestResult('Table doesn\'t exist. This is expected if it\'s the first test.');
        } else {
          setTestResult(`Table insert failed: ${error.message}`);
        }
      } else {
        setTestResult('Successfully inserted row into test table!');
      }
    } catch (err) {
      console.error('Table test error:', err);
      setTestResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

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
              <p><strong>Last Sign In:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Test Auth Request</h2>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
            onClick={testAuthRequest}
          >
            Test Auth Refresh
          </button>
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={testTableCreation}
          >
            Test Table Insert
          </button>
          {testResult && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p>{testResult}</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Refresh Connection Test</h2>
          <button 
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            onClick={checkConnection}
          >
            Refresh Connection Test
          </button>
        </div>
      </div>
    </div>
  );
}