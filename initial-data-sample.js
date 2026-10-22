export const CATEGORIES = ['AI & ML', 'Fintech', 'DevTools', 'E-Commerce', 'HealthTech', 'EdTech', 'CyberSecurity'];

// Генерация 105 полноценных записей для выполнения требования (не менее 100 элементов)
export function generateInitialStartups() {
  const prefixes = ['Hyper', 'Data', 'Cloud', 'Cyber', 'Quantum', 'Omni', 'Neural', 'Pulse', 'Flow', 'Nexus', 'Sync', 'Meta', 'Apex', 'Vivid', 'Smart'];
  const suffixes = ['AI', 'IO', 'Labs', 'Hub', 'Grid', 'Flow', 'Scale', 'Stack', 'Core', 'Logic', 'Wave', 'Verse', 'Sphere', 'Shift', 'Forge'];

  const tagPool = {
    'AI & ML': ['LLM', 'Computer Vision', 'Automation', 'NLP', 'Predictive', 'Agents'],
    'Fintech': ['Payments', 'DeFi', 'Banking', 'Crypto', 'Insurtech', 'Accounting'],
    'DevTools': ['CI/CD', 'Monitoring', 'API', 'Security', 'Database', 'Kubernetes'],
    'E-Commerce': ['B2B Marketplace', 'Analytics', 'Logistics', 'Personalization', 'SaaS'],
    'HealthTech': ['Telehealth', 'Diagnostics', 'BioTech', 'EHR', 'Wearables', 'Wellness'],
    'EdTech': ['LMS', 'Gamification', 'Tutoring', 'Skills', 'Language', 'STEM'],
    'CyberSecurity': ['Zero Trust', 'IAM', 'SOC', 'Encryption', 'Cloud Security', 'Compliance']
  };

  const fundingStages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Bootstrapped'];

  const startups = [];

  for (let i = 1; i <= 105; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const prefix = prefixes[(i * 3) % prefixes.length];
    const suffix = suffixes[(i * 7) % suffixes.length];
    const name = `${prefix}${suffix}`;
    
    const availableTags = tagPool[category];
    const selectedTags = [
      availableTags[i % availableTags.length],
      availableTags[(i + 2) % availableTags.length]
    ];

    const mrr = Math.floor(((i * 137) % 85 + 5) * 1000); // 5,000 - 90,000 $
    const rating = parseFloat(((i % 15) * 0.1 + 3.5).toFixed(1)); // 3.5 - 4.9
    const year = 2018 + (i % 7); // 2018 - 2024
    const teamSize = 3 + ((i * 5) % 48); // 3 - 50 человек
    const stage = fundingStages[i % fundingStages.length];

    startups.push({
      id: `str-${i}`,
      name,
      tagline: `Next-generation ${category.toLowerCase()} platform empowering modern enterprises.`,
      category,
      mrr,
      rating: Math.min(5.0, rating),
      tags: selectedTags,
      foundedYear: year,
      teamSize,
      fundingStage: stage,
      description: `${name} provides an enterprise-grade ${category} engine designed to scale operations, optimize productivity, and deliver real-time data insights for global teams.`,
      website: `https://${name.toLowerCase()}.example.io`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString()
    });
  }

  return startups;
}
