# TenantIQ — AI-Powered Tenant Management Agent
## DataHacks 2026 | ML/AI Track Build Plan

---

## Project Summary

**TenantIQ** is an AI agent that autonomously handles the three biggest pain points for small-to-mid landlords managing long-term rentals: maintenance triage & vendor dispatch, rent collection communication, and routine tenant inquiries. Unlike existing portal-based tools (TurboTenant, RentRedi, Buildium), TenantIQ doesn't just organize information — it *acts* on it.

**Track:** Machine Learning / AI ($5,000 prize pool)

**Target Challenges:**
- Best Use of Gemini API (Google) — agent reasoning, NLP triage, message generation
- Best Use of AWS Services — Lambda, DynamoDB, SES/SNS for messaging
- Most Innovative Idea (The Basement) — first autonomous agent for long-term rental management

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                   │
│  Dashboard: Properties | Tenants | Agent Activity    │
│  Live Feed: Messages sent, tickets triaged, vendors  │
└──────────────────────┬──────────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────────┐
│              AGENT ORCHESTRATOR (Node.js)             │
│  Routes inbound messages → classification → action   │
└──┬───────────┬────────────┬─────────────────────────┘
   │           │            │
   ▼           ▼            ▼
┌──────┐  ┌────────┐  ┌──────────────┐
│TRIAGE│  │COMMS   │  │VENDOR MATCH  │
│ENGINE│  │ENGINE  │  │ENGINE        │
│      │  │        │  │              │
│Gemini│  │Gemini  │  │Scoring Model │
│ API  │  │ API    │  │+ Google      │
│      │  │+ SES   │  │  Places API  │
└──┬───┘  └───┬────┘  └──────┬───────┘
   │          │               │
   ▼          ▼               ▼
┌─────────────────────────────────────────────────────┐
│                 AWS DynamoDB                          │
│  Tables: Properties | Tenants | Tickets |            │
│          Vendors | Messages | AgentLog               │
└─────────────────────────────────────────────────────┘
```

---

## Feature Scope (Priority Order)

### P0 — Demo Centerpiece: Maintenance Triage + Vendor Dispatch
**This is what you demo to judges. Build this first.**

**Flow:**
1. Tenant sends a message: *"Hey, my kitchen faucet has been dripping nonstop since yesterday"*
2. Agent (Gemini) classifies: `category: plumbing`, `urgency: medium`, `type: leak`
3. Agent asks follow-up: *"Is water pooling on the floor or just dripping from the faucet handle?"*
4. Tenant responds: *"Just dripping from the handle"*
5. Agent confirms triage: `urgency: low-medium`, `estimated_fix: faucet cartridge replacement`
6. Agent queries vendor database → ranks 3 plumbers by composite score
7. Agent sends landlord summary + top vendor recommendation
8. Agent messages tenant: *"We've identified this as a faucet cartridge issue. A licensed plumber has been contacted and should reach out within 24 hours to schedule."*

**ML Components:**
- **Intent Classification** (Gemini): Categorize message as maintenance, rent question, lease question, complaint, general inquiry
- **Urgency Scoring** (Gemini + rules): 1-5 scale based on keywords, safety implications, and tenant follow-up answers
- **Vendor Scoring Model** (custom): Weighted composite score

**Vendor Scoring Model (your ML track differentiator):**
```
Score = w1(price_norm) + w2(rating_norm) + w3(response_time_norm) 
      + w4(distance_norm) + w5(specialty_match) + w6(reliability_score)

Where:
- price_norm = 1 - (vendor_price / max_price_in_category)
- rating_norm = vendor_rating / 5.0
- response_time_norm = 1 - (avg_hours / max_hours)
- distance_norm = 1 - (distance_miles / max_radius)
- specialty_match = 1.0 if exact match, 0.5 if adjacent, 0.0 if unrelated
- reliability_score = completed_jobs / total_assigned_jobs

Default weights: w1=0.20, w2=0.25, w3=0.20, w4=0.10, w5=0.15, w6=0.10
```

For the hackathon, seed the vendor database with synthetic data pulled from Google Places API ratings + generated performance metrics. In the demo, show the scoring model ranking vendors in real-time.

---

### P1 — Rent Communication Automation
**Build this second. Quick win, high demo value.**

**Flow:**
1. Agent checks lease data daily (Lambda cron)
2. 5 days before due: friendly reminder → *"Hey [name], just a heads up — rent of $[amount] is due on [date]. You can pay via [portal link]."*
3. 1 day before due: nudge → *"Quick reminder: rent is due tomorrow."*
4. 1 day late: firm → *"Your rent payment of $[amount] was due yesterday. Please submit payment to avoid a late fee of $[fee]."*
5. 7 days late: escalation → notifies landlord with tenant payment history

**ML Components:**
- **Tone Calibration** (Gemini): Adjusts language based on tenant's payment history (always-on-time gets casual tone, frequently-late gets firmer)
- **Payment Risk Prediction**: Simple model using past payment dates to flag likely-late tenants *before* due date

---

### P2 — Routine Inquiry Handling
**Build this third if time permits. Solid addition but not critical for demo.**

Agent autonomously answers the top 10 tenant questions without landlord involvement:
- When is rent due?
- What's my lease end date?
- Can I have a pet?
- Who do I contact for emergencies?
- What's the guest policy?
- How do I submit a maintenance request?
- What utilities am I responsible for?
- When was my last payment?
- Can I sublease?
- What's the move-out process?

Pulls answers from lease data + property rules stored in DynamoDB. Gemini generates natural responses.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React (Next.js) | Fast setup, SSR, good demo experience |
| Agent Brain | Gemini API | Challenge prize + free tier + strong reasoning |
| Database | AWS DynamoDB | Challenge prize + serverless + fast reads |
| Scheduled Tasks | AWS Lambda + EventBridge | Cron for rent reminders, daily checks |
| Messaging | AWS SES (email) + Twilio (SMS) | SES is free tier, Twilio has hackathon credits |
| Vendor Data | Google Places API | Real ratings/reviews for vendor seeding |
| Hosting | AWS Amplify or EC2 | Challenge prize alignment |
| Auth | Clerk or NextAuth | Fast auth setup for demo |

---

## Database Schema (DynamoDB)

### Properties Table
```json
{
  "property_id": "prop_001",
  "address": "123 Main St, Apt 4B",
  "landlord_id": "ll_001",
  "units": 4,
  "rules": {
    "pets_allowed": false,
    "guest_policy": "Max 7 days",
    "sublease": false,
    "utilities_tenant": ["electric", "internet"],
    "utilities_included": ["water", "trash"]
  }
}
```

### Tenants Table
```json
{
  "tenant_id": "ten_001",
  "property_id": "prop_001",
  "name": "Alex Johnson",
  "email": "alex@email.com",
  "phone": "+1234567890",
  "lease_start": "2025-06-01",
  "lease_end": "2026-05-31",
  "rent_amount": 1800,
  "rent_due_day": 1,
  "late_fee": 75,
  "payment_history": [
    { "month": "2026-01", "paid_date": "2026-01-01", "amount": 1800 },
    { "month": "2026-02", "paid_date": "2026-02-03", "amount": 1800 },
    { "month": "2026-03", "paid_date": "2026-03-01", "amount": 1800 }
  ]
}
```

### Tickets Table (Maintenance)
```json
{
  "ticket_id": "tkt_001",
  "tenant_id": "ten_001",
  "property_id": "prop_001",
  "created_at": "2026-04-13T10:30:00Z",
  "raw_message": "My kitchen faucet has been dripping nonstop since yesterday",
  "category": "plumbing",
  "urgency": 3,
  "status": "vendor_assigned",
  "triage_log": [
    { "step": "classification", "result": "plumbing/leak", "confidence": 0.94 },
    { "step": "follow_up_asked", "question": "Is water pooling on the floor?" },
    { "step": "follow_up_received", "answer": "Just dripping from handle" },
    { "step": "final_assessment", "result": "faucet cartridge replacement", "urgency": 3 }
  ],
  "assigned_vendor": "vnd_003",
  "vendor_score": 0.87
}
```

### Vendors Table
```json
{
  "vendor_id": "vnd_003",
  "name": "Mike's Plumbing",
  "specialty": ["plumbing"],
  "avg_price": 150,
  "rating": 4.6,
  "avg_response_hours": 4,
  "distance_miles": 3.2,
  "jobs_completed": 23,
  "jobs_assigned": 25,
  "reliability_score": 0.92,
  "phone": "+1987654321",
  "email": "mike@mikesplumbing.com"
}
```

---

## Gemini API Prompts

### Maintenance Triage Prompt
```
You are a property maintenance triage agent. Analyze the tenant's message 
and respond with a JSON object.

TENANT MESSAGE: "{message}"

PROPERTY CONTEXT:
- Property type: {property_type}
- Building age: {building_age}

Respond ONLY with valid JSON:
{
  "category": "plumbing|electrical|hvac|appliance|structural|pest|general",
  "urgency": 1-5 (1=cosmetic, 3=needs attention this week, 5=emergency),
  "issue_type": "brief description of likely issue",
  "follow_up_question": "question to ask tenant for better diagnosis, or null",
  "diy_possible": true/false,
  "diy_suggestion": "if diy_possible, a simple step they can try first",
  "safety_concern": true/false
}
```

### Rent Reminder Tone Calibration
```
You are a property management communication assistant. Generate a rent 
reminder message for this tenant.

CONTEXT:
- Tenant name: {name}
- Rent amount: ${amount}
- Due date: {due_date}
- Days until due: {days}
- Payment history: {on_time_percentage}% on-time over last 12 months
- Reminder stage: {friendly|nudge|firm|escalation}

RULES:
- If on_time_percentage > 90%: casual, warm tone
- If on_time_percentage 70-90%: professional, clear tone
- If on_time_percentage < 70%: direct, firm tone (never aggressive)
- Always include the amount and due date
- Keep under 3 sentences
- Never threaten eviction

Respond with just the message text, no JSON.
```

---

## Hour-by-Hour Build Timeline (36 hours)

### Phase 1: Foundation (Hours 1-6)
- [ ] Initialize Next.js project with Tailwind
- [ ] Set up AWS account + DynamoDB tables
- [ ] Create seed data script (3 properties, 8 tenants, 15 vendors)
- [ ] Build basic API routes: GET/POST for properties, tenants, tickets
- [ ] Test Gemini API connection with a simple classification call

### Phase 2: Triage Engine (Hours 6-14) ← CRITICAL PATH
- [ ] Build maintenance triage endpoint
- [ ] Implement Gemini classification prompt
- [ ] Build follow-up question flow (stateful conversation)
- [ ] Implement vendor scoring model
- [ ] Connect Google Places API to seed real vendor ratings
- [ ] Build vendor matching endpoint that returns ranked results
- [ ] Test full flow: message → classify → follow-up → vendor match

### Phase 3: Communication Engine (Hours 14-20)
- [ ] Set up AWS Lambda for scheduled rent checks
- [ ] Build rent reminder generation with Gemini tone calibration
- [ ] Implement escalation logic (5-day, 1-day, late, very-late)
- [ ] Set up AWS SES for email sending (or mock it for demo)
- [ ] Build message log in DynamoDB

### Phase 4: Dashboard (Hours 20-28)
- [ ] Property overview page (list of properties + key stats)
- [ ] Tenant list with payment status indicators
- [ ] Maintenance ticket feed (live activity log)
- [ ] Vendor leaderboard showing top-ranked vendors by category
- [ ] Agent activity log (every decision the agent made, timestamped)

### Phase 5: Polish + Demo Prep (Hours 28-36)
- [ ] Add loading states and error handling
- [ ] Create demo walkthrough script
- [ ] Seed compelling demo data (a few active tickets, payment history)
- [ ] Test full demo flow end-to-end 3 times
- [ ] Prepare slides / talking points
- [ ] Record backup demo video (in case live demo fails)

---

## Demo Script (3-5 minutes)

### Opening (30 sec)
"Small landlords managing 1-50 units spend 16+ hours a month just answering tenant messages. 49% of all tenant complaints online are about neglected repairs. The problem isn't that landlords don't care — it's that they're overwhelmed. TenantIQ is an AI agent that handles maintenance, communication, and vendor coordination autonomously."

### Live Demo (3 min)

**Beat 1 — Maintenance Triage (90 sec)**
- Show a tenant message arriving: "My bathroom ceiling is leaking water when the upstairs neighbor showers"
- Watch the agent classify it in real-time: `plumbing | urgency: 4 | water intrusion`
- Agent asks follow-up: "Is the water actively dripping now, or only during/after showers?"
- Tenant responds: "Only during showers"
- Agent finalizes: "Likely a shower pan or drain seal issue in unit above"
- Agent ranks 3 plumbers, shows scoring breakdown
- Agent sends tenant confirmation with ETA

**Beat 2 — Rent Automation (45 sec)**
- Show the dashboard with upcoming rent due dates
- Click into a tenant with 95% on-time history → show the casual, warm reminder
- Click into a tenant with 60% on-time history → show the direct, firm reminder
- Show the escalation that went to the landlord after 7 days late

**Beat 3 — Agent Activity Log (45 sec)**
- Show the timestamped log of every autonomous decision
- "In the last 24 hours, the agent handled 12 tenant messages, triaged 3 maintenance requests, dispatched 2 vendors, and sent 8 rent reminders — all without the landlord touching anything."

### Close (30 sec)
"TenantIQ turns property management from reactive to autonomous. Built on Gemini for reasoning, AWS for scale, and a custom vendor scoring model that gets smarter with every job completed."

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Gemini API rate limits | Cache common classifications, batch non-urgent requests |
| Demo breaks live | Pre-record backup video of full demo flow |
| Scope creep on UI | Use shadcn/ui components, don't custom-style anything |
| Vendor data feels fake | Pull real business names/ratings from Google Places, add synthetic performance data on top |
| DynamoDB setup takes too long | Fallback to Supabase (Postgres) — same schema works |
| Teammate gets stuck | P0 (triage) and P1 (rent) can be built independently in parallel |

---

## What Judges Will Look For (ML/AI Track)

Based on the track description, align your pitch to these criteria:

1. **Intelligent systems that learn from data** → Vendor scoring model improves as more jobs are logged. Payment risk prediction uses historical data.
2. **Automate decisions** → Agent autonomously triages, dispatches, and communicates without human input.
3. **Full ML pipeline** → Data preprocessing (message cleaning) → Feature engineering (vendor scores) → Model evaluation (triage accuracy) → Deployment (live agent)
4. **Impact, creativity, technical depth** → Real-world problem validated by market research. Novel approach (agent vs. portal). Multiple ML components working together.

---

## Post-Hackathon Expansion Ideas (for Q&A)

If judges ask "where does this go next?":
- **Predictive maintenance**: Use ticket history to predict which properties will need repairs before tenants report them
- **Vendor marketplace**: Two-sided platform where vendors compete for jobs based on their reliability scores
- **Tenant satisfaction scoring**: NLP sentiment analysis on tenant messages to predict churn risk
- **Multi-property portfolio analytics**: Aggregate maintenance costs, response times, and tenant satisfaction across portfolios
