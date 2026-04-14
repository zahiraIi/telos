import { triageMessage } from './triage';
import { rankVendors } from './vendor';
import { generateRentReminder } from './comms';
import { generateContent } from '@/lib/gemini/client';
import { inquiryPrompt } from '@/lib/gemini/prompts';
import { SEED_VENDORS, SEED_TENANTS, SEED_PROPERTIES } from '@/lib/db/seed';

export type PipelineContext = Record<string, unknown>;

export async function executeNode(
  nodeType: string,
  context: PipelineContext,
): Promise<PipelineContext> {
  switch (nodeType) {
    case 'tenantMessage': {
      const message =
        (context.tenantMessage as string) ??
        'My kitchen faucet has been dripping nonstop since yesterday';
      const tenantId = (context.tenantId as string) ?? 'ten_001';
      const tenant = SEED_TENANTS.find((t) => t.tenant_id === tenantId) ?? SEED_TENANTS[0];

      return {
        summary: 'Tenant message received',
        message,
        tenant_id: tenant.tenant_id,
        tenant_name: tenant.name,
        tenant_email: tenant.email,
        property_id: tenant.property_id,
        timestamp: new Date().toISOString(),
      };
    }

    case 'geminiClassify': {
      const message = (context.message as string) ?? 'General maintenance issue';
      const property = SEED_PROPERTIES.find(
        (p) => p.property_id === (context.property_id as string),
      );

      const result = await triageMessage(
        message,
        property ? 'apartment' : 'apartment',
        '10 years',
      );

      return {
        summary: `Classified: ${result.category} | urgency: ${result.urgency}`,
        category: result.category,
        urgency: result.urgency,
        issue_type: result.issue_type,
        follow_up_question: result.follow_up_question,
        diy_possible: result.diy_possible,
        diy_suggestion: result.diy_suggestion,
        safety_concern: result.safety_concern,
      };
    }

    case 'followUpQuestion': {
      const question =
        (context.follow_up_question as string) ??
        'Can you provide more details about the issue?';
      const category = (context.category as string) ?? 'general';
      const urgency = (context.urgency as number) ?? 3;

      return {
        summary: question
          ? `Follow-up: "${question}"`
          : 'No follow-up needed',
        question,
        response_pending: true,
        category,
        urgency,
        estimated_fix: (context.issue_type as string) ?? 'Pending assessment',
      };
    }

    case 'vendorScore': {
      const category = (context.category as string) ?? 'general';
      const ranked = rankVendors(SEED_VENDORS, category);
      const top = ranked[0];

      return {
        summary: `Top vendor: ${top?.name} (score: ${top?.score})`,
        rankings: ranked.slice(0, 3),
        selected_vendor_id: top?.vendor_id,
        selected_vendor_name: top?.name,
        selected_vendor_score: top?.score,
        category,
      };
    }

    case 'assignVendor': {
      const vendorId = (context.selected_vendor_id as string) ?? 'vnd_003';
      const vendorName = (context.selected_vendor_name as string) ?? 'Unknown Vendor';
      const vendorScore = (context.selected_vendor_score as number) ?? 0;
      const tenantId = (context.tenant_id as string) ?? 'ten_001';
      const category = (context.category as string) ?? 'general';
      const urgency = (context.urgency as number) ?? 3;

      return {
        summary: `Vendor assigned: ${vendorName}`,
        vendor_id: vendorId,
        vendor_name: vendorName,
        vendor_score: vendorScore,
        tenant_id: tenantId,
        ticket_id: `tkt_${Date.now()}`,
        category,
        urgency,
      };
    }

    case 'notifyLandlord': {
      const category = (context.category as string) ?? 'general';
      const urgency = (context.urgency as number) ?? 3;
      const vendorName = (context.vendor_name as string) ?? 'Pending';
      const message = (context.message as string) ?? '';
      const propertyId = (context.property_id as string) ?? 'prop_001';
      const property = SEED_PROPERTIES.find((p) => p.property_id === propertyId);

      return {
        summary: `Landlord notified — ${category} (P${urgency}) → ${vendorName}`,
        notification: {
          type: 'maintenance_triage',
          property: property?.address ?? propertyId,
          tenant_message: message,
          category,
          urgency,
          vendor: vendorName,
          vendor_score: context.vendor_score,
        },
      };
    }

    case 'sendEmail': {
      const tenantEmail = (context.tenant_email as string) ?? 'tenant@email.com';
      const tenantName = (context.tenant_name as string) ?? 'Tenant';
      const category = (context.category as string) ?? '';
      const vendorName = (context.vendor_name as string) ?? '';
      const issueType = (context.issue_type as string) ?? (context.estimated_fix as string) ?? '';
      const reminderMessage = context.reminder_message as string | undefined;

      if (reminderMessage) {
        return {
          summary: `Reminder sent to ${tenantName}`,
          to: tenantEmail,
          subject: 'Rent Reminder',
          body: reminderMessage,
        };
      }

      const body = category
        ? `Hi ${tenantName}, we've identified your issue as ${issueType} (${category}). ${vendorName ? `${vendorName} has been contacted and should reach out within 24 hours to schedule.` : 'A vendor will be assigned shortly.'}`
        : (context.answer as string) ?? `Hi ${tenantName}, your request has been processed.`;

      return {
        summary: `Email sent to ${tenantName}`,
        to: tenantEmail,
        subject: category ? 'Maintenance Request Update' : 'Your Inquiry Response',
        body,
      };
    }

    case 'sendSms': {
      const tenantName = (context.tenant_name as string) ?? 'Tenant';
      const category = (context.category as string) ?? 'maintenance';

      return {
        summary: `SMS sent to ${tenantName}`,
        to: (context.tenant_phone as string) ?? '+1234567890',
        message: `Your ${category} request has been received and a vendor has been assigned.`,
      };
    }

    case 'scheduleTrigger': {
      const now = new Date();
      const tenantsToNotify = SEED_TENANTS.filter((t) => {
        const dueDay = t.rent_due_day;
        const today = now.getDate();
        const diff = dueDay - today;
        return diff <= 5 && diff >= -7;
      });

      return {
        summary: `Schedule triggered — ${tenantsToNotify.length} tenants due soon`,
        triggered_at: now.toISOString(),
        tenants_to_check: tenantsToNotify.length,
        tenant_ids: tenantsToNotify.map((t) => t.tenant_id),
        first_tenant_id: tenantsToNotify[0]?.tenant_id ?? SEED_TENANTS[0].tenant_id,
      };
    }

    case 'leaseDataLookup': {
      const tenantId =
        (context.first_tenant_id as string) ??
        (context.tenant_id as string) ??
        SEED_TENANTS[0].tenant_id;
      const tenant = SEED_TENANTS.find((t) => t.tenant_id === tenantId) ?? SEED_TENANTS[0];
      const property = SEED_PROPERTIES.find((p) => p.property_id === tenant.property_id);

      return {
        summary: `Lease data: ${tenant.name} — $${tenant.rent_amount}/mo`,
        tenant_id: tenant.tenant_id,
        tenant_name: tenant.name,
        tenant_email: tenant.email,
        rent_amount: tenant.rent_amount,
        rent_due_day: tenant.rent_due_day,
        lease_end: tenant.lease_end,
        late_fee: tenant.late_fee,
        payment_history: tenant.payment_history,
        property_rules: property?.rules ?? {},
        property_address: property?.address ?? '',
      };
    }

    case 'toneCalibrate': {
      const tenantId = (context.tenant_id as string) ?? SEED_TENANTS[0].tenant_id;
      const tenant = SEED_TENANTS.find((t) => t.tenant_id === tenantId) ?? SEED_TENANTS[0];

      const dueDay = tenant.rent_due_day;
      const today = new Date().getDate();
      const daysUntilDue = dueDay - today;

      const reminder = await generateRentReminder(tenant, daysUntilDue);

      return {
        summary: `Tone: ${reminder.stage} (${reminder.onTimePercentage}% on-time)`,
        stage: reminder.stage,
        on_time_percentage: reminder.onTimePercentage,
        reminder_message: reminder.message,
        tenant_id: tenant.tenant_id,
        tenant_name: tenant.name,
        tenant_email: tenant.email,
      };
    }

    case 'answerInquiry': {
      const question = (context.message as string) ?? 'General inquiry';
      const leaseData = {
        tenant_name: context.tenant_name,
        rent_amount: context.rent_amount,
        rent_due_day: context.rent_due_day,
        lease_end: context.lease_end,
        late_fee: context.late_fee,
      };
      const propertyRules = (context.property_rules as Record<string, unknown>) ?? {};

      try {
        const answer = await generateContent(
          inquiryPrompt(question, leaseData, propertyRules),
        );
        return {
          summary: `Answered: "${question.slice(0, 50)}..."`,
          question,
          answer: answer.trim(),
          ai_powered: true,
        };
      } catch {
        return {
          summary: `Inquiry forwarded to landlord (AI unavailable)`,
          question,
          answer: `We've received your question about: "${question}". A property manager will respond within 24 hours.`,
          ai_powered: false,
        };
      }
    }

    case 'manualTrigger':
      return {
        summary: 'Manual trigger activated',
        triggered_by: 'landlord',
        timestamp: new Date().toISOString(),
      };

    case 'logDecision': {
      const entries = Object.entries(context)
        .filter(([k]) => k === 'summary' || k === 'category' || k === 'urgency' || k === 'vendor_name')
        .map(([k, v]) => `${k}: ${v}`);

      return {
        summary: `Decision logged: ${entries.join(', ') || 'workflow completed'}`,
        log_id: `log_${Date.now()}`,
        logged_context_keys: Object.keys(context),
      };
    }

    default:
      return {
        summary: `Node ${nodeType} executed (no handler)`,
        nodeType,
      };
  }
}
