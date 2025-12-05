import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SelectionPanel from '../components/SelectionPanel';

function BaseLayout({
  children,
  showSidebar = true,
  showSelectionPanel = false,
  selectionPanelData,
  currentPage,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Mobile Header */}
      {showSidebar && (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-800 border-b border-slate-700 flex items-center px-4 z-40">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-300 hover:text-white p-2"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-white text-lg">QShift</span>
        </div>
      )}

      {showSidebar && (
        <>
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div
            className={`
            fixed inset-y-0 left-0 z-50 w-48 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          >
            <Sidebar currentPage={currentPage} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </>
      )}

      <div
        className={`flex-1 flex flex-col lg:flex-row lg:pt-0 overflow-auto lg:overflow-hidden ${showSidebar ? `pt-16` : ``}`}
      >
        <div className="flex-1 p-4 w-full lg:overflow-auto">{children}</div>

        {showSelectionPanel && selectionPanelData && (
          <div className="border-t border-slate-700 bg-slate-900/50 lg:h-full lg:overflow-y-auto shrink-0">
            <div className="p-4">
              <SelectionPanel {...selectionPanelData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BaseLayout;
