import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Breadcrumbs } from './components/layout/Breadcrumbs';
import { Footer } from './components/layout/Footer';
import { ProjectLayout } from './components/layout/ProjectLayout';
import { SearchModal } from './components/modals/SearchModal';
import { OverviewView } from './components/views/OverviewView';
import { CaptureMindView } from './components/views/CaptureMindView';
import { VisiofactView } from './components/views/VisiofactView';
import { KnowledgeView } from './components/views/KnowledgeView';
import { GenericProjectView } from './components/views/GenericProjectView';
import { PROJECTS } from './config/projectsConfig';
import { ProjectConfig, ProjectId } from './types/hub';
import { officialValidatedEmailToFriderich, targetedEmailToFriderich } from './data/hubData';

function AppContent() {
  const [projectsList, setProjectsList] = useState<ProjectConfig[]>(PROJECTS);
  const [currentProjectId, setCurrentProjectId] = useState<ProjectId>('overview');
  const [activeViewMap, setActiveViewMap] = useState<Record<string, string>>({
    capturemind: 'conception',
    visiofact: 'decisions',
    knowledge: 'chronologie',
    'agent-ia': 'cadrage'
  });
  const [activeSubTabId, setActiveSubTabId] = useState<string>('planning-30j');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [copiedPrimaryAction, setCopiedPrimaryAction] = useState<boolean>(false);

  const isOverview = currentProjectId === 'overview';

  // Active project config (if on a specific project)
  const currentProject =
    projectsList.find((p) => p.id === currentProjectId) || projectsList[0];
  const activeViewId =
    activeViewMap[currentProjectId] || currentProject.defaultViewId;
  const currentView =
    currentProject.views.find((v) => v.id === activeViewId) ||
    currentProject.views[0];

  // Handler for project selection
  const handleSelectProject = (id: ProjectId, viewId?: string) => {
    setCurrentProjectId(id);
    if (id !== 'overview') {
      const targetProj = projectsList.find((p) => p.id === id);
      if (targetProj) {
        const targetView = viewId || activeViewMap[id] || targetProj.defaultViewId;
        setActiveViewMap((prev) => ({ ...prev, [id]: targetView }));
      }
    }
  };

  // Handler for view selection
  const handleSelectView = (viewId: string) => {
    setActiveViewMap((prev) => ({ ...prev, [currentProjectId]: viewId }));
  };

  // Handler for search navigation
  const handleSearchNavigate = (
    projectId: ProjectId,
    viewId: string,
    subTabId?: string
  ) => {
    setCurrentProjectId(projectId);
    setActiveViewMap((prev) => ({ ...prev, [projectId]: viewId }));
    if (subTabId) {
      setActiveSubTabId(subTabId);
    }
  };

  // Handler to dynamically register a new project
  const handleAddNewProject = (newProject: ProjectConfig) => {
    setProjectsList((prev) => [...prev, newProject]);
    setActiveViewMap((prev) => ({
      ...prev,
      [newProject.id]: newProject.defaultViewId
    }));
  };

  // Primary Action Button (Header or ProjectLayout)
  const handlePrimaryAction = async () => {
    try {
      let textToCopy = officialValidatedEmailToFriderich;
      if (currentProjectId === 'visiofact') {
        textToCopy = targetedEmailToFriderich;
      } else if (currentProjectId === 'knowledge') {
        textToCopy = 'Synthèse Stratégique Digipepss 2026 : Accord formel direction, 0 octet disque RAM, maintien B2Brouter et préparation DGFiP janvier 2027.';
      } else if (currentProject.templateData) {
        textToCopy = `Dossier Technique : ${currentProject.name} (${currentProject.version})\nStatut : ${currentProject.status}\nLead : ${currentProject.lead} | Direction : ${currentProject.direction}\nÉchéance : ${currentProject.targetDeadline}`;
      }

      await navigator.clipboard.writeText(textToCopy);
      setCopiedPrimaryAction(true);
      setTimeout(() => setCopiedPrimaryAction(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Subtab label for breadcrumbs
  const activeSubTabLabel =
    !isOverview && activeViewId === 'conception' && currentView?.subTabs
      ? currentView.subTabs.find((s) => s.id === activeSubTabId)?.label
      : undefined;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* 1. Sticky Global Header with auto-generated project switcher */}
      <Header
        projects={projectsList}
        currentProjectId={currentProjectId}
        onSelectProject={handleSelectProject}
        onOpenSearch={() => setSearchOpen(true)}
        onPrimaryAction={handlePrimaryAction}
        copiedPrimaryAction={copiedPrimaryAction}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* 2. Breadcrumbs Bar (with direct return to Hub Overview) */}
      <Breadcrumbs
        currentProject={currentProject}
        activeViewLabel={isOverview ? "Vue d'ensemble" : currentView?.label || ''}
        activeSubTabLabel={activeSubTabLabel}
        isOverview={isOverview}
        onNavigateToOverview={() => setCurrentProjectId('overview')}
        onResetToProject={() => handleSelectView(currentProject.defaultViewId)}
      />

      {/* 3. Main Workspace Container (Sidebar + Content View) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Contextual Sidebar Navigation (One single level per zone) */}
        <Sidebar
          currentProject={currentProject}
          allProjects={projectsList}
          currentProjectId={currentProjectId}
          onSelectProject={handleSelectProject}
          activeViewId={activeViewId}
          onSelectView={handleSelectView}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Scrollable View Content */}
        <main
          id="main-content"
          role="main"
          className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar"
        >
          {/* A. Vue d'Ensemble Mode */}
          {isOverview ? (
            <OverviewView
              projects={projectsList}
              onSelectProject={handleSelectProject}
              onAddNewProject={handleAddNewProject}
            />
          ) : (
            /* B. Generic Project Layout wrapper for active project */
            <ProjectLayout
              project={currentProject}
              activeViewId={activeViewId}
              activeSubTabId={activeSubTabId}
              onSubTabChange={(subTab) => setActiveSubTabId(subTab)}
              onPrimaryAction={handlePrimaryAction}
              copiedPrimaryAction={copiedPrimaryAction}
            >
              {/* Bespoke Project Views */}
              {currentProjectId === 'capturemind' && (
                <CaptureMindView
                  activeViewId={activeViewId}
                  activeSubTabId={activeSubTabId}
                  onSubTabChange={(subTab) => setActiveSubTabId(subTab)}
                />
              )}

              {currentProjectId === 'visiofact' && (
                <VisiofactView activeViewId={activeViewId} />
              )}

              {currentProjectId === 'knowledge' && (
                <KnowledgeView activeViewId={activeViewId} />
              )}

              {/* Dynamic / New Projects rendered via GenericProjectView template */}
              {currentProjectId !== 'capturemind' &&
                currentProjectId !== 'visiofact' &&
                currentProjectId !== 'knowledge' && (
                  <GenericProjectView
                    project={currentProject}
                    activeViewId={activeViewId}
                  />
                )}
            </ProjectLayout>
          )}
        </main>
      </div>

      {/* 4. Global Footer */}
      <Footer />

      {/* 5. Quick Search Modal (⌘K / Ctrl+K) */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleSearchNavigate}
        projects={projectsList}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
