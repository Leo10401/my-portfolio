export const profile = {
  name: 'Ayush Kumar Yadav',
  email: 'kanhayia0004@gmail.com',
  website: 'https://devtacet.me',
  github: 'https://github.com/Leo10401',
  linkedin: 'https://www.linkedin.com/in/ayush-kumar-yadav-a78840348/',
  resume: '/ayush-kumar-yadav-resume.pdf',
}

export type Project = {
  slug: string
  name: string
  category: string
  headline: string
  description: string
  image: string
  imageAlt: string
  stack: string[]
  github: string
  live?: string
  problem: string
  approach: string
  decisions: { title: string; body: string }[]
  outcome: string
  evidence: string
  steps: { title: string; body: string }[]
}

export const projects: Project[] = [
  {
    slug: 'blog-mind', name: 'Blog Mind', category: 'Full-stack platform',
    headline: 'A place for ideas to find their people.',
    description: 'A blogging community built around conversation, friendly competition, and the people behind the words.',
    image: '/images/blogmind.png', imageAlt: 'Concept artwork of publishing sheets and a glass Blog Mind panel',
    stack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'], github: 'https://github.com/Leo10401/BlogMind', live: 'https://blog-mind.vercel.app',
    problem: 'Publishing a post is only the beginning. Blog Mind brings discussion, writer identity, and participation into one community instead of treating a blog as a collection of isolated articles.',
    approach: 'A MERN architecture connects the React reading experience to Express APIs and MongoDB. Threaded comments and profiles provide the social layer; competitions, rewards, and a global leaderboard give readers a reason to participate.',
    decisions: [
      { title: 'Build for conversation', body: 'Threaded comments preserve the context of a discussion. User profiles connect contributions back to the people making them.' },
      { title: 'Make participation visible', body: 'Blog competitions, points, and a global leaderboard support a community experience beyond publishing and reading.' },
      { title: 'Keep database work focused', body: 'MongoDB indexing and aggregation pipelines reduce unnecessary database round-trips for the content experience.' },
    ],
    outcome: 'A full-stack community platform combining publishing, discussion, profiles, and gamification. My résumé reports support for 200+ concurrent users and a 40% reduction in database round-trips.',
    evidence: 'Features and performance figures are documented in my résumé. Performance figures are self-reported, not an independent benchmark.',
    steps: [{ title: 'Write', body: 'Create and publish ideas through the blogging platform.' }, { title: 'Discuss', body: 'Keep conversations connected with threaded comments and writer profiles.' }, { title: 'Participate', body: 'Bring the community together through competitions, points, and a leaderboard.' }],
  },
  {
    slug: 'prithvika', name: 'Prithvika', category: 'Applied AI',
    headline: 'A closer look at the ground beneath us.',
    description: 'Soil-practice analysis that connects field images, machine learning, and satellite vegetation signals.',
    image: '/images/prithvika.png', imageAlt: 'Concept artwork of a floating farmland soil sample and a scanning layer',
    stack: ['Next.js', 'FastAPI', 'PyTorch', 'Sentinel-2'], github: 'https://github.com/Leo10401/Prithvika',
    problem: 'A field photograph gives a local view of agricultural practices, but not the whole picture. This project explores combining that view with satellite vegetation signals to make the analysis more contextual.',
    approach: 'A PyTorch multi-label model estimates visible residue, tillage, and cover crops. The FastAPI service retrieves Sentinel-2 NDVI using Microsoft Planetary Computer, combines the signals into a trust score, and returns them to a Next.js dashboard.',
    decisions: [
      { title: 'Use multiple labels', body: 'A single field can show more than one practice. The classifier produces separate probabilities for residue, tillage, and cover crops.' },
      { title: 'Add a satellite cross-check', body: 'Coordinates connect a submitted image to vegetation data. The NDVI service searches recent Sentinel-2 scenes with low cloud cover.' },
      { title: 'Expose uncertainty', body: 'When the satellite lookup fails, the backend marks its fallback with ndvi_fallback. Curated agronomic data and formal evaluation remain important next steps.' },
    ],
    outcome: 'An end-to-end research prototype with training, inference, satellite lookup, and a dashboard. It demonstrates a complete ML-to-product workflow, not validated agronomic or carbon-credit certification.',
    evidence: 'Architecture, model labels, fallback behavior, and limitations are documented in the public repository README.',
    steps: [{ title: 'Field image', body: 'Upload a farm photograph and supply its coordinates.' }, { title: 'Independent signals', body: 'Classify visible practices and retrieve satellite vegetation data.' }, { title: 'Combined analysis', body: 'Present model probabilities, NDVI, and a composite trust score with fallback status.' }],
  },
  {
    slug: 'diffomatic', name: 'DiffOMatic', category: 'Developer tool',
    headline: 'Find what changed. Not just what moved.',
    description: 'One comparison workflow for text, images, documents, archives, and media files.',
    image: '/images/diffomatic.png', imageAlt: 'Concept artwork of two etched glass code sheets showing differences',
    stack: ['Next.js', 'React', 'TypeScript', 'Node.js'], github: 'https://github.com/Leo10401/diff-0-Matic', live: 'https://diff-0-matic.vercel.app',
    problem: 'Comparing two versions becomes fragmented when each file format needs its own tool. DiffOMatic brings those comparisons into a shared visual experience.',
    approach: 'A TypeScript and Next.js interface supports a multi-format visual diff workflow. The project covers text, images, audio, video, ZIP archives, Word documents, and Excel spreadsheets.',
    decisions: [
      { title: 'One entry point, different formats', body: 'Use a shared comparison workflow while respecting that documents, text, and media need different visual treatment.' },
      { title: 'Make the difference visible', body: 'A real-time visual diff engine focuses attention on changes rather than requiring people to inspect two unrelated screens.' },
      { title: 'Consider larger files', body: 'The résumé documents support for files up to 50 MB. Actual behavior depends on format and the deployed environment.' },
    ],
    outcome: 'A multi-format comparison tool supporting seven file categories. The interactive sample below demonstrates a comparison concept without uploading or processing any files.',
    evidence: 'Supported formats and the 50 MB file-size claim are from my résumé. The sample is illustrative and is not the deployed diff engine.',
    steps: [{ title: 'Choose files', body: 'Select the original and revised versions in the same format.' }, { title: 'Compare', body: 'Use the format-specific comparison view to identify changes.' }, { title: 'Inspect', body: 'Review the differences with their surrounding context.' }],
  },
  {
    slug: 'draftpal', name: 'Draftpal', category: 'AI productivity',
    headline: 'From a rough idea to a ready-to-send email.',
    description: 'AI-assisted email templates and bulk delivery, brought into one practical workflow.',
    image: '/images/draftpal.png', imageAlt: 'Concept artwork of a silver envelope, paper cards, and a paper plane',
    stack: ['React', 'Node.js', 'Express', 'Nodemailer'], github: 'https://github.com/Leo10401/Draftpal-buddy', live: 'https://draftpal-buddy.vercel.app',
    problem: 'Creating a responsive HTML email and sending it to a recipient list often requires several disconnected steps. Draftpal brings composition and delivery together.',
    approach: 'A React frontend supports the email creation experience. The Node.js and Express backend connects AI-assisted template generation with Nodemailer for bulk delivery.',
    decisions: [
      { title: 'Start with the message', body: 'AI-assisted template generation helps turn a communication goal into a responsive HTML email.' },
      { title: 'Treat email as its own medium', body: 'Responsive HTML output is central to the project, rather than treating an email as an ordinary web page.' },
      { title: 'Connect creation to delivery', body: 'Nodemailer supports bulk sending from the same workflow, reducing the steps between writing and delivery.' },
    ],
    outcome: 'A working email creation and delivery tool. My résumé reports bulk delivery to 1,000+ recipients and a 70% reduction in email creation time; these are self-reported project results.',
    evidence: 'Project functionality and figures are documented in my résumé. This portfolio does not send emails or call an AI model.',
    steps: [{ title: 'Describe', body: 'Explain the purpose, audience, and message of an email.' }, { title: 'Compose', body: 'Generate and review a responsive HTML email template.' }, { title: 'Deliver', body: 'Use the application’s bulk delivery workflow for the recipient list.' }],
  },
  {
    slug: 'meetcap', name: 'MeetCap', category: 'Browser extension',
    headline: 'Keep the conversation after the meeting.',
    description: 'A Chrome extension that captures Google Meet captions and turns them into something you can revisit.',
    image: '/images/meetcap.png', imageAlt: 'Concept artwork of a silver waveform transforming into glass caption strips',
    stack: ['JavaScript', 'Chrome APIs', 'Node.js', 'Express'], github: 'https://github.com/Leo10401/MeetCap',
    problem: 'Live meeting captions are useful in the moment but easy to lose afterward. MeetCap makes them available for later review, with speaker context and structured export.',
    approach: 'The Chrome extension captures captions with speaker names and saves them locally. Users can export JSON or explicitly request an AI-powered summary through a configurable backend.',
    decisions: [
      { title: 'Retain speaker context', body: 'Captions are captured with speaker names so a saved conversation retains the context of who said what.' },
      { title: 'Make export straightforward', body: 'JSON export makes captured captions portable instead of keeping them trapped in the extension.' },
      { title: 'Make summarization intentional', body: 'The README describes local caption storage, with data sent to the configured backend only when the user requests an AI summary.' },
    ],
    outcome: 'A practical Chrome extension connecting live captions, local review, structured export, and optional AI summarization. Capturing conversations should always respect participant consent and applicable policies.',
    evidence: 'Features, setup, and data flow are documented in the public repository. No Chrome Web Store listing is claimed.',
    steps: [{ title: 'Capture', body: 'Start and stop caption recording during a meeting.' }, { title: 'Review', body: 'Revisit saved captions with their speaker names or export JSON.' }, { title: 'Summarize', body: 'Explicitly request a summary through the configured backend.' }],
  },
]
