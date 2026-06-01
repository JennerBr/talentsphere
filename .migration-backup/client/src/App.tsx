import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CompanyProvider } from "@/lib/company-context";
import NotFound from "@/pages/not-found";

import Login from "@/pages/login";
import ManagerDashboard from "@/pages/manager-dashboard";
import ManagerTeam from "@/pages/manager-team";
import ManagerMobility from "@/pages/manager-mobility";
import EmployeeDashboard from "@/pages/employee-dashboard";
import EmployeeProfile from "@/pages/employee-profile";
import EmployeePDI from "@/pages/employee-pdi";

import AdminOrganizações from "@/pages/admin-organizacoes";
import AdminOrganizaçãoForm from "@/pages/admin-organizacao-form";
import AdminPosicoes from "@/pages/admin-posicoes";
import AdminCargos from "@/pages/admin-cargos";
import AdminTrilhas from "@/pages/admin-trilhas";
import AdminFuncoes from "@/pages/admin-funcoes";
import AdminHabilidades from "@/pages/admin-habilidades";
import AdminSkillCategories from "@/pages/admin-skill-categories";
import AdminProjetos from "@/pages/admin-projetos";
import AdminHobbies from "@/pages/admin-hobbies";
import AdminHobbyCategories from "@/pages/admin-hobby-categories";
import AdminLogTypes from "@/pages/admin-log-types";
import AdminAbsenceTypes from "@/pages/admin-absence-types";
import AdminActionTypes from "@/pages/admin-action-types";
import AbsenceManagement from "@/pages/absence-management";
import ScheduleCalendar from "@/pages/schedule-calendar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/login" />} />
      <Route path="/login" component={Login} />
      
      {/* Manager Routes */}
      <Route path="/manager" component={ManagerDashboard} />
      <Route path="/manager/team" component={ManagerTeam} />
      <Route path="/manager/mobility" component={ManagerMobility} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={() => <Redirect to="/admin/organizacoes" />} />
      <Route path="/admin/organizacoes" component={AdminOrganizações} />
      <Route path="/admin/organizacoes/:id" component={AdminOrganizaçãoForm} />
      <Route path="/admin/posicoes" component={AdminPosicoes} />
      <Route path="/admin/cargos" component={AdminCargos} />
      <Route path="/admin/trilhas" component={AdminTrilhas} />
      <Route path="/admin/funcoes" component={AdminFuncoes} />
      <Route path="/admin/habilidades/tipos" component={AdminSkillCategories} />
      <Route path="/admin/habilidades" component={AdminHabilidades} />
      <Route path="/admin/hobbies/tipos" component={AdminHobbyCategories} />
      <Route path="/admin/hobbies" component={AdminHobbies} />
      <Route path="/admin/log-types" component={AdminLogTypes} />
      <Route path="/admin/absence-types" component={AdminAbsenceTypes} />
      <Route path="/admin/action-types" component={AdminActionTypes} />

      {/* Employee Routes */}
      <Route path="/radar" component={EmployeeProfile} />
      <Route path="/profile" component={EmployeeProfile} />
      <Route path="/pdi" component={EmployeePDI} />
      <Route path="/ausencias" component={AbsenceManagement} />
      <Route path="/calendar" component={ScheduleCalendar} />
      <Route path="/projetos" component={AdminProjetos} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CompanyProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </CompanyProvider>
    </QueryClientProvider>
  );
}

export default App;