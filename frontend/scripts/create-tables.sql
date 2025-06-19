-- Create the home_page_content table
CREATE TABLE IF NOT EXISTS home_page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the updated_at column for better query performance
CREATE INDEX IF NOT EXISTS idx_home_page_content_updated_at ON home_page_content(updated_at DESC);

-- Insert default content
INSERT INTO home_page_content (content) VALUES (
  '{
    "hero": {
      "badge": "Exclusive for Lang Students",
      "title": "Dress to",
      "highlightWord": "Impress",
      "description": "This sustainable program allows Lang students to borrow business casual attire for all of their academic and job search needs. This initiative helps B.Comm students put their best foot forward, thanks to generous clothing donations from the Lang community.",
      "buttonText": "Browse Collection",
      "buttonLink": "/browse"
    },
    "howItWorks": {
      "title": "How It Works",
      "subtitle": "A simple three-step process to get you looking your best for any professional occasion",
      "steps": [
        {
          "id": "browse",
          "icon": "Search",
          "title": "Browse & Select",
          "description": "Explore our curated collection of professional attire available for your selected dates"
        },
        {
          "id": "pickup",
          "icon": "Clock",
          "title": "Pick Up",
          "description": "Collect your items from the Business Career Development Centre (MACS 101)"
        },
        {
          "id": "return",
          "icon": "Package",
          "title": "Return",
          "description": "Simply return your items - we handle the dry cleaning!"
        }
      ]
    },
    "rentalGuidelines": {
      "title": "Rental Guidelines",
      "subtitle": "Simple rules to ensure everyone has access to professional attire",
      "rules": [
        {
          "id": "period",
          "icon": "Calendar",
          "title": "Rental Period",
          "items": ["Two-week rental period from pickup date", "Extensions available with BCDC approval"]
        },
        {
          "id": "hours",
          "icon": "Clock4",
          "title": "Operating Hours",
          "items": ["Monday to Friday: 8:30 AM - 4:30 PM", "Closed on weekends and holidays"]
        },
        {
          "id": "location",
          "icon": "MapPin",
          "title": "Location",
          "items": ["Business Career Development Centre (MACS 101)", "All pickups and returns must be done in person"]
        },
        {
          "id": "additional",
          "icon": "Sparkles",
          "title": "Additional Info",
          "items": ["No cleaning required - we handle all dry cleaning", "Items must be returned in good condition"]
        }
      ]
    },
    "cta": {
      "title": "Looking to Donate Clothes to the Program?",
      "email": "langcareers@uoguelph.ca",
      "emailLabel": "Email us at"
    }
  }'::jsonb
)
ON CONFLICT DO NOTHING;
