-- Create table for storing gift web configurations
CREATE TABLE IF NOT EXISTS public.gifts (
    id TEXT PRIMARY KEY,
    template TEXT NOT NULL,
    anniversary_date TEXT,
    password TEXT,
    wishes JSONB NOT NULL,
    images JSONB NOT NULL,
    customer_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous select (reading gift details)
CREATE POLICY "Allow public read access" ON public.gifts
    FOR SELECT USING (true);

-- Create policy to allow anonymous insert (creating a gift)
CREATE POLICY "Allow public insert access" ON public.gifts
    FOR INSERT WITH CHECK (true);
