// Content script - runs on every page to extract content

// Detect page type based on URL and content
function detectPageType() {
  const url = window.location.href.toLowerCase();
  const hostname = window.location.hostname.toLowerCase();
  const title = document.title.toLowerCase();
  const bodyText = document.body.innerText.toLowerCase();

  // LinkedIn pages
  if (hostname.includes('linkedin.com')) {
    if (url.includes('/jobs/') || url.includes('/job/')) return 'linkedin_job';
    if (url.includes('/company/')) return 'linkedin_company';
    if (url.includes('/in/')) return 'linkedin_profile';
    return 'linkedin_other';
  }

  // Job boards and hiring pages
  const jobKeywords = ['careers', 'jobs', 'hiring', 'positions', 'vacancies', 'openings', 'join us', 'join our team', 'we are hiring', 'apply now'];
  const jobUrlPatterns = ['/careers', '/jobs', '/hiring', '/vacancies', '/open-positions', '/join-us'];

  if (jobUrlPatterns.some(p => url.includes(p)) ||
      jobKeywords.some(k => title.includes(k)) ||
      (bodyText.includes('apply') && (bodyText.includes('position') || bodyText.includes('role')))) {
    return 'hiring_page';
  }

  // Company about/homepage detection
  const aboutPatterns = ['/about', '/o-nama', '/about-us', '/company', '/who-we-are'];
  if (aboutPatterns.some(p => url.includes(p))) {
    return 'company_about';
  }

  // Homepage or company website (no specific path)
  if (window.location.pathname === '/' || window.location.pathname === '') {
    return 'company_homepage';
  }

  return 'generic';
}

// Extract readable text from the page
function extractPageContent() {
  const pageType = detectPageType();

  // Extract additional structured data
  const metadata = {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content || '',
    ogTitle: document.querySelector('meta[property="og:title"]')?.content || '',
    ogDescription: document.querySelector('meta[property="og:description"]')?.content || '',
  };

  // Route to specific extractor
  switch (pageType) {
    case 'linkedin_job':
      return { type: pageType, ...extractLinkedInJob(), metadata };
    case 'linkedin_company':
      return { type: pageType, ...extractLinkedInCompany(), metadata };
    case 'linkedin_profile':
      return { type: pageType, ...extractLinkedInProfile(), metadata };
    case 'hiring_page':
      return { type: pageType, ...extractHiringPage(), metadata };
    case 'company_about':
    case 'company_homepage':
      return { type: pageType, ...extractCompanyPage(), metadata };
    default:
      return { type: 'generic', ...extractGenericPage(), metadata };
  }
}

// LinkedIn Job extraction
function extractLinkedInJob() {
  const jobTitle = document.querySelector('.jobs-unified-top-card__job-title, .job-details-jobs-unified-top-card__job-title, h1')?.innerText || '';
  const company = document.querySelector('.jobs-unified-top-card__company-name, .job-details-jobs-unified-top-card__company-name, a[data-tracking-control-name="public_jobs_topcard-org-name"]')?.innerText || '';
  const location = document.querySelector('.jobs-unified-top-card__bullet, .job-details-jobs-unified-top-card__bullet')?.innerText || '';
  const description = document.querySelector('.jobs-description__content, .jobs-box__html-content, .description__text')?.innerText || '';

  const text = `
JOB POSTING: ${jobTitle}
COMPANY: ${company}
LOCATION: ${location}

JOB DESCRIPTION:
${description}
  `.trim();

  return { jobTitle, company, location, description, text: text.substring(0, 15000) };
}

// LinkedIn Company extraction
function extractLinkedInCompany() {
  const companyName = document.querySelector('h1')?.innerText || '';
  const tagline = document.querySelector('.org-top-card-summary__tagline, .top-card-layout__headline')?.innerText || '';
  const industry = document.querySelector('.org-top-card-summary-info-list__info-item, .top-card-layout__first-subline')?.innerText || '';
  const about = document.querySelector('.org-about-us-organization-description__text, .core-section-container__content p, section.summary p')?.innerText || '';
  const employees = document.querySelector('[data-test-id="employees-count"], .org-top-card-summary-info-list__info-item:nth-child(3)')?.innerText || '';

  // Get specialties/services if available
  const specialties = Array.from(document.querySelectorAll('.org-about-company-module__specialities dd, .specialties'))
    .map(el => el.innerText).join(', ');

  const text = `
COMPANY: ${companyName}
TAGLINE: ${tagline}
INDUSTRY: ${industry}
SIZE: ${employees}
${specialties ? `SPECIALTIES: ${specialties}` : ''}

ABOUT:
${about}
  `.trim();

  return { companyName, tagline, industry, about, employees, specialties, text: text.substring(0, 15000) };
}

// LinkedIn Profile extraction
function extractLinkedInProfile() {
  const name = document.querySelector('h1')?.innerText || '';
  const headline = document.querySelector('.text-body-medium, .top-card-layout__headline')?.innerText || '';
  const about = document.querySelector('#about')?.closest('section')?.innerText ||
                document.querySelector('.core-section-container--with-content-padding')?.innerText || '';
  const experience = document.querySelector('#experience')?.closest('section')?.innerText || '';
  const skills = Array.from(document.querySelectorAll('[data-field="skill_card_skill_name"], .skill-categories li'))
    .map(el => el.innerText).join(', ');

  const text = `
PERSON: ${name}
ROLE: ${headline}

ABOUT:
${about}

EXPERIENCE:
${experience}

SKILLS: ${skills}
  `.trim();

  return { name, headline, about, experience, skills, text: text.substring(0, 15000) };
}

// Hiring/Jobs page extraction
function extractHiringPage() {
  // Try to find job listings container
  const jobListings = [];

  // Common job listing selectors
  const jobCards = document.querySelectorAll(
    '[class*="job-card"], [class*="job-listing"], [class*="position-card"], ' +
    '[class*="career-card"], [class*="vacancy"], article, .job, .position'
  );

  jobCards.forEach((card, i) => {
    if (i < 10) { // Limit to first 10 jobs
      const title = card.querySelector('h2, h3, h4, [class*="title"]')?.innerText || '';
      const dept = card.querySelector('[class*="department"], [class*="team"], [class*="category"]')?.innerText || '';
      const loc = card.querySelector('[class*="location"]')?.innerText || '';
      if (title) jobListings.push(`• ${title}${dept ? ` (${dept})` : ''}${loc ? ` - ${loc}` : ''}`);
    }
  });

  // Get company info from page
  const companyName = document.querySelector('h1, [class*="company-name"], .logo + *')?.innerText || '';

  // Get page description
  const introText = document.querySelector(
    '[class*="intro"], [class*="hero"] p, [class*="header"] p, main > p, .careers-intro'
  )?.innerText || '';

  const text = `
HIRING PAGE: ${companyName || document.title}

${introText}

OPEN POSITIONS:
${jobListings.length > 0 ? jobListings.join('\n') : 'No structured job listings found.'}

PAGE CONTENT:
${getCleanBodyText().substring(0, 10000)}
  `.trim();

  return { companyName, introText, jobListings, text: text.substring(0, 15000) };
}

// Company website extraction
function extractCompanyPage() {
  const companyName = document.querySelector('h1, [class*="company-name"], .logo + *, header h1')?.innerText ||
                      document.title.split('|')[0].split('-')[0].trim();

  // Get hero/intro section
  const heroText = document.querySelector(
    '[class*="hero"] p, [class*="intro"] p, [class*="banner"] p, .tagline, .subtitle, main > p:first-of-type'
  )?.innerText || '';

  // Get about section
  const aboutSection = document.querySelector(
    '[id*="about"], [class*="about"], section:has(h2:contains("About")), .company-description'
  )?.innerText || '';

  // Get services/products
  const services = Array.from(document.querySelectorAll(
    '[class*="service"] h3, [class*="product"] h3, [class*="solution"] h3, [class*="offering"] h3'
  )).map(el => el.innerText).join(', ');

  // Get tech stack if visible
  const techStack = Array.from(document.querySelectorAll(
    '[class*="tech"] img[alt], [class*="stack"] img[alt], [class*="partner"] img[alt]'
  )).map(el => el.alt).filter(Boolean).join(', ');

  const text = `
COMPANY: ${companyName}
${heroText ? `\nTAGLINE: ${heroText}` : ''}
${services ? `\nSERVICES: ${services}` : ''}
${techStack ? `\nTECH STACK: ${techStack}` : ''}

ABOUT:
${aboutSection || getCleanBodyText().substring(0, 5000)}
  `.trim();

  return { companyName, heroText, aboutSection, services, techStack, text: text.substring(0, 15000) };
}

// Generic page extraction
function extractGenericPage() {
  const text = getCleanBodyText();
  return { text: text.substring(0, 15000) };
}

// Helper: Get clean body text
function getCleanBodyText() {
  const clone = document.body.cloneNode(true);
  const removeElements = clone.querySelectorAll('script, style, noscript, iframe, svg, nav, footer, header, [class*="cookie"], [class*="popup"], [class*="modal"], [class*="banner"]');
  removeElements.forEach(el => el.remove());

  let text = clone.innerText || clone.textContent || '';
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();

  return text;
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
