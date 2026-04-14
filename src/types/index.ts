export type NodeCategory = 'trigger' | 'processor' | 'action';

export type NodeStatus = 'idle' | 'running' | 'success' | 'error' | 'waiting';

export interface WorkflowNodeType {
  type: string;
  label: string;
  category: NodeCategory;
  icon: string;
  description: string;
}

export interface WorkflowNodeData {
  [key: string]: unknown;
  label: string;
  category: NodeCategory;
  icon: string;
  description: string;
  nodeType: string;
  status: NodeStatus;
  output?: Record<string, unknown>;
  config?: Record<string, unknown>;
}

export interface ExecutionLogEntry {
  id: string;
  timestamp: string;
  nodeId: string;
  nodeLabel: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  data?: Record<string, unknown>;
}

export interface Property {
  property_id: string;
  address: string;
  landlord_id: string;
  units: number;
  rules: {
    pets_allowed: boolean;
    guest_policy: string;
    sublease: boolean;
    utilities_tenant: string[];
    utilities_included: string[];
  };
}

export interface PaymentRecord {
  month: string;
  paid_date: string;
  amount: number;
}

export interface Tenant {
  tenant_id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  lease_start: string;
  lease_end: string;
  rent_amount: number;
  rent_due_day: number;
  late_fee: number;
  payment_history: PaymentRecord[];
}

export interface TriageStep {
  step: string;
  result?: string;
  question?: string;
  answer?: string;
  confidence?: number;
  urgency?: number;
}

export interface Ticket {
  ticket_id: string;
  tenant_id: string;
  property_id: string;
  created_at: string;
  raw_message: string;
  category: string;
  urgency: number;
  status: string;
  triage_log: TriageStep[];
  assigned_vendor?: string;
  vendor_score?: number;
}

export interface Vendor {
  vendor_id: string;
  name: string;
  specialty: string[];
  avg_price: number;
  rating: number;
  avg_response_hours: number;
  distance_miles: number;
  jobs_completed: number;
  jobs_assigned: number;
  reliability_score: number;
  phone: string;
  email: string;
}

export interface TriageResult {
  category: string;
  urgency: number;
  issue_type: string;
  follow_up_question: string | null;
  diy_possible: boolean;
  diy_suggestion: string | null;
  safety_concern: boolean;
}

export interface VendorScoreResult {
  vendor_id: string;
  name: string;
  score: number;
  breakdown: {
    price: number;
    rating: number;
    response_time: number;
    distance: number;
    specialty: number;
    reliability: number;
  };
}
