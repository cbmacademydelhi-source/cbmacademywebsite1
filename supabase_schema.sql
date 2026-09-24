-- Supabase Schema for CBM Academy Webinar Registrations with QR Code & Payment Architecture
-- Run this in your Supabase SQL Editor if the table does not exist or run ALTER TABLE for existing databases.

CREATE TABLE IF NOT EXISTS webinar_registrations (
  id TEXT PRIMARY KEY,
  webinar_id TEXT NOT NULL,
  webinar_title TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  registration_type TEXT NOT NULL DEFAULT 'free' CHECK (registration_type IN ('free', 'paid')),
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_status TEXT NOT NULL DEFAULT 'not_required' CHECK (payment_status IN ('not_required', 'pending', 'paid', 'failed', 'expired')),
  registration_status TEXT NOT NULL DEFAULT 'pending' CHECK (registration_status IN ('pending', 'approved', 'cancelled')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  razorpay_qr_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  paid_at TIMESTAMPTZ
);

-- Upgrade existing table if columns were not present
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinar_registrations' AND column_name = 'registration_status') THEN
    ALTER TABLE webinar_registrations ADD COLUMN registration_status TEXT NOT NULL DEFAULT 'pending';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinar_registrations' AND column_name = 'razorpay_qr_id') THEN
    ALTER TABLE webinar_registrations ADD COLUMN razorpay_qr_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinar_registrations' AND column_name = 'paid_at') THEN
    ALTER TABLE webinar_registrations ADD COLUMN paid_at TIMESTAMPTZ;
  END IF;
END $$;

-- Indexes for fast filtering and duplicate prevention
CREATE INDEX IF NOT EXISTS idx_webinar_reg_webinar_id ON webinar_registrations(webinar_id);
CREATE INDEX IF NOT EXISTS idx_webinar_reg_email ON webinar_registrations(email);
CREATE INDEX IF NOT EXISTS idx_webinar_reg_payment_status ON webinar_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_webinar_reg_registration_status ON webinar_registrations(registration_status);
CREATE INDEX IF NOT EXISTS idx_webinar_reg_razorpay_qr_id ON webinar_registrations(razorpay_qr_id);
CREATE INDEX IF NOT EXISTS idx_webinar_reg_created_at ON webinar_registrations(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE webinar_registrations ENABLE ROW LEVEL SECURITY;

-- Allow insert from anon/authenticated users (so registrations can be submitted)
CREATE POLICY "Allow public insert webinar registrations" 
ON webinar_registrations 
FOR INSERT 
WITH CHECK (true);

-- Allow select/read only for service role or authenticated admin
CREATE POLICY "Allow service role full access" 
ON webinar_registrations 
FOR ALL 
USING (auth.role() = 'service_role');

