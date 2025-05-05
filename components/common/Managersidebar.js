import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Table } from 'lucide-react';

const RestaurantManagerSidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full md:w-64 h-full bg-[#2d3748] text-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Restaurant<br />Manager</h2>
      </div>
      
      <nav className="py-6 space-y-1">
        <Link
          to="/restaurant-manager"
          className={`block px-6 py-3 ${
            isActive('/restaurant-manager')
              ? 'bg-[#1e2533] border-l-4 border-primary'
              : 'hover:bg-[#1e2533]'
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
        </Link>
        
        <Link
          to="/restaurant-manager/add-restaurant"
          className={`block px-6 py-3 ${
            isActive('/restaurant-manager/add-restaurant')
              ? 'bg-[#1e2533] border-l-4 border-primary'
              : 'hover:bg-[#1e2533]'
          }`}
        >
          <div className="flex items-center gap-3">
            <PlusCircle size={20} />
            <span>Add Restaurant</span>
          </div>
        </Link>
        
        <Link
          to="/restaurant-manager/add-tables"
          className={`block px-6 py-3 ${
            isActive('/restaurant-manager/add-tables')
              ? 'bg-[#1e2533] border-l-4 border-primary'
              : 'hover:bg-[#1e2533]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Table size={20} />
            <span>Add Tables</span>
          </div>
        </Link>
        
        <Link
          to="/restaurant-manager/manage-tables"
          className={`block px-6 py-3 ${
            isActive('/restaurant-manager/manage-tables')
              ? 'bg-[#1e2533] border-l-4 border-primary'
              : 'hover:bg-[#1e2533]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Table size={20} />
            <span>Manage Tables</span>
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default RestaurantManagerSidebar;