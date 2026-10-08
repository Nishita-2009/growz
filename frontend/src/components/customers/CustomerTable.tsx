import React, { useState, useMemo } from 'react';
import { CustomerListItem, CustomerSegment, CustomerStatus } from '../../types/customers';
import { 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  User, 
  Filter
} from 'lucide-react';

interface CustomerTableProps {
  customers: CustomerListItem[];
  selectedSegment: CustomerSegment;
  onSelectSegment: (segment: CustomerSegment) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

type SortField = 'name' | 'orders' | 'totalSpent' | 'avgOrderValue' | 'lastPurchase';
type SortOrder = 'asc' | 'desc';

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  selectedSegment,
  onSelectSegment,
  searchQuery,
  onSearchChange
}) => {
  const [sortField, setSortField] = useState<SortField>('totalSpent');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      // Search filter
      const matchesSearch = 
        cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cust.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Segment filter
      const matchesSegment = 
        selectedSegment === 'All Customers' ? true :
        selectedSegment === 'New' ? cust.segment === 'New' :
        selectedSegment === 'Returning' ? cust.segment === 'Returning' :
        selectedSegment === 'High Value' ? cust.segment === 'High Value' :
        selectedSegment === 'At Risk' ? cust.segment === 'At Risk' :
        selectedSegment === 'Inactive' ? cust.segment === 'Inactive' : true;

      // Status filter
      const matchesStatus = statusFilter === 'All' ? true : cust.status === statusFilter;

      return matchesSearch && matchesSegment && matchesStatus;
    });
  }, [customers, searchQuery, selectedSegment, statusFilter]);

  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredCustomers, sortField, sortOrder]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(sortedCustomers.length / itemsPerPage));
  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case 'Loyal':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'At Risk':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Inactive':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getSegmentBadge = (segment: string) => {
    switch (segment) {
      case 'High Value':
        return 'bg-violet-500/15 text-violet-300 border-violet-500/30';
      case 'New':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'Returning':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
      case 'At Risk':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-5">
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white tracking-tight">Customer Directory</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing {filteredCustomers.length} of {customers.length} records. Filter, sort, or search profiles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Statuses</option>
              <option value="Active" className="bg-slate-900">Active</option>
              <option value="Loyal" className="bg-slate-900">Loyal</option>
              <option value="At Risk" className="bg-slate-900">At Risk</option>
              <option value="Inactive" className="bg-slate-900">Inactive</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer name, email, city..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/90 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">
                <button 
                  onClick={() => handleSort('name')} 
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>Customer</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">
                <button 
                  onClick={() => handleSort('orders')} 
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>Orders</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th className="py-3.5 px-4">
                <button 
                  onClick={() => handleSort('totalSpent')} 
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>Total Spent</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th className="py-3.5 px-4">
                <button 
                  onClick={() => handleSort('avgOrderValue')} 
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>Avg Order Value</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th className="py-3.5 px-4">Last Purchase</th>
              <th className="py-3.5 px-4">Segment</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {paginatedCustomers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-slate-400">
                  No matching customers found. Try clearing filters or changing search terms.
                </td>
              </tr>
            ) : (
              paginatedCustomers.map((cust) => {
                const initials = cust.name.split(' ').map(n => n[0]).join('');
                return (
                  <tr key={cust.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${cust.avatarColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                          {initials}
                        </div>
                        <div>
                          <span className="font-bold text-slate-200 block leading-snug group-hover:text-emerald-400 transition-colors">
                            {cust.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block">{cust.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{cust.location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 font-mono font-semibold">
                      {cust.orders}
                    </td>
                    <td className="py-3.5 px-4 text-slate-100 font-mono font-extrabold">
                      ${cust.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 font-mono">
                      ${cust.avgOrderValue.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{cust.lastPurchase}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getSegmentBadge(cust.segment)}`}>
                        {cust.segment}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(cust.status)}`}>
                        {cust.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer UI */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
        <span>
          Showing Page <strong className="text-slate-200">{currentPage}</strong> of <strong className="text-slate-200">{totalPages}</strong>
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
