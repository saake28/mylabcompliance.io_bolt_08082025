import { supabase } from './lib/supabase';

export async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Check if environment variables are available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'undefined'
    });
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return {
        success: false,
        sessionOk: false,
        tableOk: false,
        error: `Missing environment variables: ${!supabaseUrl ? 'VITE_SUPABASE_URL ' : ''}${!supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY' : ''}. Please check your .env file and ensure it contains valid Supabase project credentials.`
      };
    }

    // Validate URL format
    try {
      new URL(supabaseUrl);
    } catch (urlError) {
      console.error('Invalid Supabase URL format:', supabaseUrl);
      return {
        success: false,
        sessionOk: false,
        tableOk: false,
        error: `Invalid VITE_SUPABASE_URL format: "${supabaseUrl}". Please ensure it's a valid URL (e.g., https://your-project.supabase.co)`
      };
    }

    // Test 1: Check if we can get the session
    console.log('Test 1: Checking session...');
    let sessionError = null;
    try {
      // Use the proper Supabase client method for session checking
      const { data: sessionData, error } = await supabase.auth.getSession();
      sessionError = error;
    } catch (err: any) {
      console.error('Session check error:', err);
      sessionError = err;
    }
    
    console.log('Session test result:', sessionError ? 'Failed' : 'Success');
    if (sessionError) console.error('Session error:', sessionError);
    
    // Test 2: Try to access a table that should exist
    console.log('Test 2: Checking table access...');
    let data: any = null;
    let tableError = null;
    try {
      // First try using Supabase client (most reliable)
      console.log('Attempting Supabase client connection...');
      const { data: clientData, error: clientError } = await supabase
        .from('organizations')
        .select('id')
        .limit(1);
      
      if (!clientError) {
        data = clientData;
        console.log('Supabase client connection successful');
      } else {
        console.warn('Supabase client failed, trying direct fetch:', clientError.message);
        
        // Fallback to direct fetch with timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000)
        );
        
        const fetchPromise = fetch(`${supabaseUrl}/rest/v1/organizations?select=id&limit=1`, {
          method: 'GET',
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        data = await response.json();
        console.log('Direct fetch successful');
      }
    } catch (err: any) {
      console.error('Table access exception:', err);
      
      if (err.message.includes('timeout') || err.name === 'AbortError') {
        tableError = { message: `Connection timeout. Please check: 1) Your internet connection, 2) Supabase project is active at ${supabaseUrl}, 3) No firewall/VPN blocking access to supabase.co` };
      } else if (err.message.includes('404')) {
        tableError = { message: `Database table not found. Please verify: 1) VITE_SUPABASE_URL is correct (${supabaseUrl}), 2) Database migrations have been run, 3) 'organizations' table exists` };
      } else if (err.message.includes('401') || err.message.includes('403')) {
        tableError = { message: `Authentication failed. Please verify: 1) VITE_SUPABASE_ANON_KEY is correct and valid, 2) Supabase project is active, 3) API key hasn't expired` };
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        tableError = { message: `Network connection failed. Please check: 1) Internet connectivity, 2) Supabase project URL is accessible (${supabaseUrl}), 3) No firewall/proxy blocking supabase.co, 4) Project is not paused or deleted` };
      } else {
        tableError = { message: `Connection error: ${err.message}. Verify: 1) .env file has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, 2) Supabase project is active, 3) Network allows access to ${supabaseUrl}` };
      }
    }
    
    console.log('Table access result:', tableError ? 'Failed' : 'Success');
    if (tableError) {
      console.error('Table error:', tableError);
    } else {
      console.log('Data received:', data ? 'Yes' : 'No');
    }
    
    return {
      success: !sessionError && !tableError,
      sessionOk: !sessionError,
      tableOk: !tableError,
      error: tableError ? tableError.message : undefined
    };
  } catch (err: any) {
    console.error('Unexpected error during connection test:', err);
    return {
      success: false,
      sessionOk: false,
      tableOk: false,
      error: `Connection test failed: ${err.message || 'Unknown network error'}. Please verify: 1) .env file exists with valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, 2) Supabase project is active and not paused, 3) Network allows HTTPS access to supabase.co domain`
    };
  }
}