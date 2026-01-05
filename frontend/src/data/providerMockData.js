export const providerStats = {
  pendingRequests: 3,
  activeJobs: 2,
  completedJobs: 45,
  totalEarnings: 125000,
  averageRating: 4.8,
};

export const jobRequests = [
  {
    id: 1,
    serviceName: "Pipe Leak Repair",
    customerName: "Ram Sharma",
    location: "Baneshwor, Kathmandu",
    dateTime: "2024-01-20 10:00 AM",
    estimatedPrice: 1500,
    expiresIn: 300, // seconds
  },
  {
    id: 2,
    serviceName: "Kitchen Sink Installation",
    customerName: "Sita Karki",
    location: "Kupandole, Lalitpur",
    dateTime: "2024-01-21 02:00 PM",
    estimatedPrice: 2500,
    expiresIn: 1800,
  },
  {
    id: 3,
    serviceName: "Bathroom Tap Replacement",
    customerName: "Hari Prasad",
    location: "Bhaktapur Durbar Square",
    dateTime: "2024-01-22 11:00 AM",
    estimatedPrice: 800,
    expiresIn: 50,
  },
];

export const assignedJobs = [
  {
    id: 101,
    serviceName: "Full House Plumbing Check",
    customerName: "Gita Thapa",
    location: "Lazimpat, Kathmandu",
    dateTime: "2024-01-23 09:00 AM",
    estimatedPrice: 5000,
    status: "Assigned",
  },
];

export const activeJobs = [
  {
    id: 201,
    serviceName: "Water Tank Cleaning",
    customerName: "Radha Krishna",
    location: "Kalanki, Kathmandu",
    dateTime: "2024-01-19 01:00 PM", // Today
    details: "1000L tank needs cleaning. Customer has requested eco-friendly cleaner.",
    status: "In Progress",
  },
  {
    id: 202,
    serviceName: "Shower Installation",
    customerName: "Bibek Poudel",
    location: "Koteshwor, Kathmandu",
    dateTime: "2024-01-19 04:00 PM",
    details: "New shower head installation. Parts provided by customer.",
    status: "Scheduled",
  },
];

export const myServices = [
  {
    id: 1,
    name: "Pipe Leak Repair",
    type: "Fixed",
    price: 1500,
    active: true,
  },
  {
    id: 2,
    name: "Water Tank Cleaning",
    type: "Per Unit",
    price: 2000,
    active: true,
  },
  {
    id: 3,
    name: "Tap Replacement",
    type: "Fixed",
    price: 500,
    active: false,
  },
  {
    id: 4,
    name: "General Plumbing",
    type: "Hourly",
    price: 1000,
    active: true,
  },
];

export const earningsHistory = [
  {
    id: "TXN-1001",
    date: "2024-01-18",
    service: "Pipe Leak Repair",
    amount: 1500,
    deduction: 15, // 1%
    finalAmount: 1485,
    method: "Cash",
  },
  {
    id: "TXN-1002",
    date: "2024-01-17",
    service: "Water Tank Cleaning",
    amount: 2000,
    deduction: 20,
    finalAmount: 1980,
    method: "Online",
  },
  {
    id: "TXN-1003",
    date: "2024-01-15",
    service: "Tap Replacement",
    amount: 500,
    deduction: 5,
    finalAmount: 495,
    method: "Cash",
  },
];

export const providerReviews = [
  {
    id: 1,
    customerName: "Ram Sharma",
    rating: 5,
    comment: "Excellent service! Very professional and punctual.",
    date: "2024-01-18",
    service: "Pipe Leak Repair",
  },
  {
    id: 2,
    customerName: "Sita Karki",
    rating: 4,
    comment: "Good job but arrived a bit late.",
    date: "2024-01-15",
    service: "Water Tank Cleaning",
  },
];
