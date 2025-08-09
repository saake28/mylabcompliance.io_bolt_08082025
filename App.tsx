import React from 'react';
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { HomePage } from './components/home/HomePage';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { TestMenuManagement } from './components/test-menu/TestMenuManagement';
import { PersonnelManagement } from './components/personnel/PersonnelManagement';
import { TrainingManagement } from './components/training/TrainingManagement';
import { InstrumentManagement } from './components/instruments/InstrumentManagement';
import { QualityControlDashboard } from './components/quality-control/QualityControlDashboard';
import { ComplianceReports } from './components/reports/ComplianceReports';
import { LaboratoryDemographics } from './components/laboratory/LaboratoryDemographics';
import { RoleManagement } from './components/access-control/RoleManagement';
import { UserRoleManagement } from './components/access-control/UserRoleManagement';
import { SubscriptionPlans } from './components/subscription/SubscriptionPlans';
import { SubscriptionSuccess } from './components/subscription/SubscriptionSuccess';
import { FeaturesPage } from './components/features/FeaturesPage';
import { SuperAdminLayout } from './components/super-admin/SuperAdminLayout';
import { SystemSettings } from './components/super-admin/SystemSettings';
import { UserManagement } from './components/super-admin/UserManagement';
import { OrganizationManagement } from './components/super-admin/OrganizationManagement';
import { AnalyticsDashboard } from './components/super-admin/AnalyticsDashboard';
import { SystemHealthDashboard } from './components/super-admin/SystemHealthDashboard';
import { AccessControlDashboard } from './components/super-admin/AccessControlDashboard';
import { OrganizationDashboard } from './components/super-admin/OrganizationDashboard';
import { SuperAdminTestMenu } from './components/super-admin/SuperAdminTestMenu';
import { SuperAdminUserManagement } from './components/super-admin/SuperAdminUserManagement';
import { SupabaseConnectionTest } from './components/super-admin/SupabaseConnectionTest';
import { FdaDatabaseVerification } from './components/super-admin/FdaDatabaseVerification';
import { OrganizationManagementPage } from './components/super-admin/OrganizationManagementPage';
import { LabradDiagnosticsDashboard } from './components/laboratory/LabradDiagnosticsDashboard';
import { GlobalLaboratoryManager } from './components/super-admin/GlobalLaboratoryManager';
import { LaboratoryCalendar } from './components/calendar/LaboratoryCalendar';

function App() {
  const { isAuthenticated, isSuperAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/subscription/success" element={<SubscriptionSuccess />} />

      {/* Protected routes for authenticated users */}
      {isAuthenticated && (
        <>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/laboratory-dashboard" element={<DashboardOverview />} />
          <Route path="/laboratory" element={<LaboratoryDemographics />} />
          <Route path="/personnel" element={<PersonnelManagement />} />
          <Route path="/training" element={<TrainingManagement />} />
          <Route path="/instruments" element={<InstrumentManagement />} />
          <Route path="/quality-control" element={<QualityControlDashboard />} />
          <Route path="/test-menu" element={<TestMenuManagement />} />
          <Route path="/quality-assurance" element={<div className="p-6"><h1 className="text-2xl font-bold">Quality Assurance</h1><p>Coming soon...</p></div>} />
          <Route path="/proficiency-testing" element={<div className="p-6"><h1 className="text-2xl font-bold">Proficiency Testing</h1><p>Coming soon...</p></div>} />
          <Route path="/calendar" element={<LaboratoryCalendar />} />
          <Route path="/calibrations" element={<div className="p-6"><h1 className="text-2xl font-bold">Calibrations</h1><p>Coming soon...</p></div>} />
          <Route path="/inventory" element={<div className="p-6"><h1 className="text-2xl font-bold">Inventory</h1><p>Coming soon...</p></div>} />
          <Route path="/analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p>Coming soon...</p></div>} />
          <Route path="/documents" element={<div className="p-6"><h1 className="text-2xl font-bold">Documents</h1><p>Coming soon...</p></div>} />
          <Route path="/reports" element={<ComplianceReports />} />
          <Route path="/roles" element={<RoleManagement />} />
          <Route path="/user-roles" element={<UserRoleManagement />} />
          <Route path="/subscription" element={<SubscriptionPlans />} />
          <Route path="/labrad-diagnostics" element={<LabradDiagnosticsDashboard />} />
        </>
      )}

      {/* Super admin routes */}
      {isSuperAdmin && (
        <>
          <Route path="/super-admin" element={<SuperAdminLayout activeTab={activeTab} onTabChange={handleTabChange} />}>
            <Route index element={<Navigate to="/super-admin/dashboard" replace />} />
            <Route path="dashboard" element={<AnalyticsDashboard />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="organizations" element={<OrganizationManagementPage />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="system-health" element={<SystemHealthDashboard />} />
            <Route path="access-control" element={<AccessControlDashboard />} />
            <Route path="organization-dashboard" element={<OrganizationDashboard />} />
            <Route path="test-menu" element={<SuperAdminTestMenu />} />
            <Route path="user-management" element={<SuperAdminUserManagement />} />
            <Route path="connection-test" element={<SupabaseConnectionTest />} />
            <Route path="fda-verification" element={<FdaDatabaseVerification />} />
            <Route path="global-lab-manager" element={<GlobalLaboratoryManager />} />
          </Route>
        </>
      )}

      {/* Redirect unauthenticated users to login */}
      <Route path="*" element={
        !isAuthenticated ? (
          <Navigate to="/login" replace />
        ) : isSuperAdmin && isSuperAdmin() ? (
          <Navigate to="/super-admin" replace />
        ) : (
          <Navigate to="/dashboard" replace />
        )
      } />
    </Routes>
  );
}

export default App;