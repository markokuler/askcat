// Content script - runs on every page to extract content

// Extract readable text from the page
function extractPageContent() {
  // Remove script and style elements
  const clone = document.body.cloneNode(true);
  const scripts = clone.querySelectorAll('script, style, noscript, iframe, svg');
  scripts.forEach(el => el.remove());

  // Get text content
  let text = clone.innerText || clone.textContent || '';

  // Clean up whitespace
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();

  // Extract additional structured data
  const metadata = {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content || '',
    ogTitle: document.querySelector('meta[property="og:title"]')?.content || '',
    ogDescription: document.querySelector('meta[property="og:description"]')?.content || '',
  };

  // LinkedIn specific extraction
  if (window.location.hostname.includes('linkedin.com')) {
    const linkedInData = extractLinkedInData();
    return {
      type: 'linkedin',
      ...linkedInData,
      metadata,
      text: text.substring(0, 20000) // Limit size
    };
  }

  // Generic extraction
  return {
    type: 'generic',
    metadata,
    text: text.substring(0, 20000)
  };
}

// LinkedIn-specific extraction
function extractLinkedInData() {
  const data = {};

  // Profile page
  if (window.location.pathname.includes('/in/')) {
    data.pageType = 'profile';
    data.name = document.querySelector('h1')?.innerText || '';
    data.headline = document.querySelector('.text-body-medium')?.innerText || '';
    data.about = document.querySelector('#about')?.closest('section')?.innerText || '';
    data.experience = document.querySelector('#experience')?.closest('section')?.innerText || '';
    data.skills = Array.from(document.querySelectorAll('[data-field="skill_card_skill_name"]'))
      .map(el => el.innerText);
  }

  // Company page
  if (window.location.pathname.includes('/company/')) {
    data.pageType = 'company';
    data.companyName = document.querySelector('h1')?.innerText || '';
    data.industry = document.querySelector('.org-top-card-summary-info-list__info-item')?.innerText || '';
    data.about = document.querySelector('.org-about-us-organization-description__text')?.innerText || '';
    data.employees = document.querySelector('.org-top-card-summary-info-list__info-item:nth-child(3)')?.innerText || '';
  }

  // Job posting
  if (window.location.pathname.includes('/jobs/')) {
    data.pageType = 'job';
    data.jobTitle = document.querySelector('.jobs-unified-top-card__job-title')?.innerText || '';
    data.company = document.querySelector('.jobs-unified-top-card__company-name')?.innerText || '';
    data.description = document.querySelector('.jobs-description__content')?.innerText || '';
  }

  return data;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageContent') {
    const content = extractPageContent();
    sendResponse({ content });
  }
  return true; // Keep the message channel open for async response
});

// Log that content script is loaded
console.log('AskCat content script loaded');
