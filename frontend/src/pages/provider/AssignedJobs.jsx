import React from 'react';
import { MapPin, Calendar, ArrowRight, User } from 'lucide-react';
import { assignedJobs, activeJobs } from '../../data/providerMockData';

const JobCard = ({ job, type }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          type === 'Active' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {job.status}
        </span>
        <h3 className="font-bold text-[#1B3C53]">{job.serviceName}</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-6 text-sm text-gray-600 mt-2">
         <div className="flex items-center">
            <User size={14} className="mr-2" /> {job.customerName}
         </div>
         <div className="flex items-center">
           <MapPin size={14} className="mr-2" /> {job.location}
         </div>
         <div className="flex items-center">
           <Calendar size={14} className="mr-2" /> {job.dateTime}
         </div>
      </div>
      
      {job.details && (
        <p className="text-sm text-gray-500 mt-3 bg-gray-50 p-2 rounded">
          <span className="font-semibold">Note:</span> {job.details}
        </p>
      )}
    </div>

    <div className="flex flex-col sm:flex-row gap-3 min-w-[150px] justify-end">
      {type === 'Assigned' ? (
        <>
           <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm">
             Reject
           </button>
           <button className="px-4 py-2 bg-[#1B3C53] text-white rounded-lg hover:bg-[#1a3248] text-sm">
             Start Job
           </button>
        </>
      ) : (
        <>
           <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center justify-center gap-2">
             <ArrowRight size={16} /> Mark Complete
           </button>
        </>
      )}
    </div>
  </div>
);

const AssignedJobs = () => {
  return (
    <div className="space-y-8">
      
      {/* Assigned Section */}
      <div>
        <h2 className="text-2xl font-bold text-[#1B3C53] mb-4">Assigned Jobs</h2>
        <div className="space-y-4">
          {assignedJobs.map(job => (
            <JobCard key={job.id} job={job} type="Assigned" />
          ))}
          {assignedJobs.length === 0 && <p className="text-gray-500">No assigned jobs.</p>}
        </div>
      </div>

    </div>
  );
};

export const ActiveJobs = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-[#1B3C53] mb-4">Active Jobs</h2>
             <div className="space-y-4">
              {activeJobs.map(job => (
                <JobCard key={job.id} job={job} type="Active" />
              ))}
              {activeJobs.length === 0 && <p className="text-gray-500">No active jobs running.</p>}
            </div>
        </div>
    )
}

export default AssignedJobs;
