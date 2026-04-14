import type { WorkflowNodeType } from '@/types';

export const NODE_TYPES: WorkflowNodeType[] = [
  // Triggers
  {
    type: 'tenantMessage',
    label: 'Tenant Message',
    category: 'trigger',
    icon: 'MessageSquare',
    description: 'Receives inbound tenant messages',
  },
  {
    type: 'scheduleTrigger',
    label: 'Schedule Trigger',
    category: 'trigger',
    icon: 'Clock',
    description: 'Cron-based scheduled trigger',
  },
  {
    type: 'manualTrigger',
    label: 'Manual Trigger',
    category: 'trigger',
    icon: 'Play',
    description: 'Manual execution trigger',
  },

  // Processors
  {
    type: 'geminiClassify',
    label: 'Gemini Classify',
    category: 'processor',
    icon: 'Brain',
    description: 'AI classification & urgency',
  },
  {
    type: 'followUpQuestion',
    label: 'Follow-Up Question',
    category: 'processor',
    icon: 'HelpCircle',
    description: 'Generate follow-up question',
  },
  {
    type: 'vendorScore',
    label: 'Vendor Score',
    category: 'processor',
    icon: 'Star',
    description: 'Weighted composite scoring',
  },
  {
    type: 'toneCalibrate',
    label: 'Tone Calibrate',
    category: 'processor',
    icon: 'Sliders',
    description: 'Adjust message tone',
  },
  {
    type: 'leaseDataLookup',
    label: 'Lease Data Lookup',
    category: 'processor',
    icon: 'Database',
    description: 'Retrieve lease/property data',
  },
  {
    type: 'answerInquiry',
    label: 'Answer Inquiry',
    category: 'processor',
    icon: 'Bot',
    description: 'AI-generated lease/policy answer',
  },

  // Actions
  {
    type: 'sendEmail',
    label: 'Send Email',
    category: 'action',
    icon: 'Mail',
    description: 'Send email via SES',
  },
  {
    type: 'sendSms',
    label: 'Send SMS',
    category: 'action',
    icon: 'MessageCircle',
    description: 'Send SMS notification',
  },
  {
    type: 'notifyLandlord',
    label: 'Notify Landlord',
    category: 'action',
    icon: 'Bell',
    description: 'Alert landlord with summary',
  },
  {
    type: 'assignVendor',
    label: 'Assign Vendor',
    category: 'action',
    icon: 'UserCheck',
    description: 'Record vendor assignment',
  },
  {
    type: 'logDecision',
    label: 'Log Decision',
    category: 'action',
    icon: 'FileText',
    description: 'Write to agent activity log',
  },
];

export const TRIGGER_NODES = NODE_TYPES.filter((n) => n.category === 'trigger');
export const PROCESSOR_NODES = NODE_TYPES.filter((n) => n.category === 'processor');
export const ACTION_NODES = NODE_TYPES.filter((n) => n.category === 'action');
