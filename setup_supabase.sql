-- SQL to setup tables for AutoPilotX

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES workflows(id),
    step TEXT,
    agent TEXT,
    action TEXT,
    result TEXT,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES workflows(id),
    task TEXT,
    assigned_to TEXT,
    status TEXT DEFAULT 'pending',
    is_escalated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI HR Onboarding Extension
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT,
  skills TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS onboarding_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidates(id),
  task TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enterprise Invoice Automation Extension
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor TEXT,
  invoice_number TEXT,
  amount NUMERIC,
  invoice_date DATE,
  status TEXT,
  validation_status TEXT,
  error_message TEXT,
  extracted_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task TEXT,
  owner TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Finance Team for demo
INSERT INTO employees (name, email, role) 
VALUES 
('Vikram Rao', 'shachindranrao@gmail.com', 'Finance Manager'),
('Arjun Kumar', 'solutionseekers402@gmail.com', 'Accountant')
ON CONFLICT DO NOTHING;

-- Workflow Health & Monitoring Extension
CREATE TABLE IF NOT EXISTS workflow_health (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID,
  issue_type TEXT,
  severity TEXT,
  message TEXT,
  status TEXT DEFAULT 'unresolved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
