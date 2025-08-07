import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./Layout";
import Clients from "./modules/clients/pages/Clients";
import LoginPage from "./modules/LoginPage";

// Guard Module
import { ThemeProvider } from "@emotion/react";
import GuardPerformancePage from "./modules/guards/components/GuardPerformancePage";
import { GuardProvider } from "./modules/guards/context/GuardContext";
import AddNewGuard from "./modules/guards/pages/AddNewGuards";
import ContentWindow from "./modules/guards/pages/GuardContentWindow";

// Client Module
import IncidentDetailsPage from "@modules/officers/components/OfficerInsights/OfficerPerformanceWindow-SubComponents/IncidentDetailsPage";
import AddClients from "./modules/clients/pages/AddClients";
import AddClientSite from "./modules/clients/pages/AddClientSite";
import AddClientUniform from "./modules/clients/pages/AddClientUniform";
import ClientGuards from "./modules/clients/pages/ClientGuards";
import AreaOfficersTasksDetails from "./modules/clients/pages/performance/AreaOfficersTasksDetails";
import AreaOfficersTasks from "./modules/clients/pages/performance/AreaOfficerTasks";
import ClientGuardDefaults from "./modules/clients/pages/performance/ClientGuardDefaults";
import ClientGuardDefaultsDetails from "./modules/clients/pages/performance/ClientGuardDefaultsDetails";
import ClientLayout from "./modules/clients/pages/performance/ClientLayout";
import ClientPerformance from "./modules/clients/pages/performance/ClientPerformance";
import GuardsTasks from "./modules/clients/pages/performance/GuardsTasks";
import IncidentReports from "./modules/clients/pages/performance/IncidentReports";

// Dashboard Module

//officer module
import { OfficerProvider } from "./modules/officers/context/OfficerContext";
import OfficerContentWindow from "./modules/officers/pages/OfficerContentWindow";

// Settings Module
import { ClientContextProvider } from "@modules/clients/context/ClientContext";
import ClientAreaOfficers from "@modules/clients/pages/ClientAreaOfficers";
import ClientSites from "@modules/clients/pages/ClientSites";
import Profile from "@modules/clients/pages/Profile";
import Sites from "@modules/clients/pages/sites/Sites";
import LiveDashboard from "@modules/dashboard/pages/LiveDashboard";
import TaskDetailsPage from "@modules/officers/components/OfficerInsights/OfficerPerformanceWindow-SubComponents/TaskDetailsPage";
import OfficerPerformancePage from "@modules/officers/components/OfficerPerformancePage";
import AddNewOfficer from "@modules/officers/pages/AddNewOfficer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddTaskFlow from "./modules/officers/pages/AddTaskFlow";
import AddNewUniform from "./modules/settings/components/AddNewUniform";
import { SettingsProvider } from "./modules/settings/context/SettingsContext";
import SettingsPage from "./modules/settings/pages/SettingsPage";
import theme from "./theme";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false, // Disable refetch on window focus for better UX
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
});

function App() {
  return (
    <main className="font-mukta">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <GuardProvider>
            <OfficerProvider>
              <SettingsProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Route WITHOUT Layout - Public Routes */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Routes WITH Layout - Protected Routes */}
                    <Route
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="/" element={<LiveDashboard />} />
                      <Route path="/clients" element={<Clients />} />
                      <Route path="/add-client" element={<AddClients />} />
                      <Route element={<ClientContextProvider />}>
                        <Route path="/clients/:clientId/add-client-uniform" element={<AddClientUniform />} />
                        <Route path="/clients/:clientId/add-client-site" element={<AddClientSite />} />
                        <Route element={<ClientLayout />}>
                          <Route path="/clients/:clientId/performance" element={<ClientPerformance />} />
                          <Route
                            path="/clients/:clientId/performance/guards-defaults"
                            element={<ClientGuardDefaults />}
                          />
                          <Route path="/clients/:clientId/performance/incident-reports" element={<IncidentReports />} />
                          <Route
                            path="/clients/:clientId/performance/area-officers-tasks"
                            element={<AreaOfficersTasks />}
                          />
                          <Route path="/clients/:clientId/performance/guards-tasks" element={<GuardsTasks />} />
                          <Route path="/clients/:clientId/guards" element={<ClientGuards />} />
                          <Route path="/clients/:clientId/area-officers" element={<ClientAreaOfficers />} />
                          <Route path="/clients/:clientId/sites" element={<ClientSites />} />
                          <Route path="/clients/:clientId/sites/:siteId" element={<Sites />} />
                          <Route path="/clients/:clientId/profile" element={<Profile />} />
                        </Route>
                        <Route
                          path="/clients/:clientId/performance/area-officers-tasks/:siteId"
                          element={<AreaOfficersTasksDetails />}
                        />
                        <Route
                          path="/clients/:clientId/performance/guards-defaults/:siteId"
                          element={<ClientGuardDefaultsDetails />}
                        />
                      </Route>
                      <Route
                        path="/clients/:clientId/performance/area-officers-tasks/:siteId"
                        element={<AreaOfficersTasksDetails />}
                      />
                      <Route
                        path="/clients/:clientId/performance/guards-defaults/:siteId"
                        element={<ClientGuardDefaultsDetails />}
                      />

                      {/* Guards Module */}
                      <Route path="/dashboard" element={<LiveDashboard />} />

                      <Route path="/guards" element={<ContentWindow />} />
                      <Route path="/guards/:guardName/performance" element={<GuardPerformancePage />} />
                      <Route path="/add-guard" element={<AddNewGuard />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/add-new-uniform" element={<AddNewUniform />} />
                      <Route path="/officers" element={<OfficerContentWindow />} />
                      <Route path="/officers/:officerName/performance" element={<OfficerPerformancePage />} />
                      <Route path="/incidents/:incidentId/details" element={<IncidentDetailsPage />} />
                      <Route path="/tasks/:taskId/details" element={<TaskDetailsPage />} />
                      <Route path="/add-officer" element={<AddNewOfficer />} />
                      <Route path="/add-task" element={<AddTaskFlow />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </SettingsProvider>
            </OfficerProvider>
          </GuardProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </main>
  );
}

export default App;
