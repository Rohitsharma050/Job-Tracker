import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Job from './models/Job.js';

dotenv.config();

const sampleJobs = [
  {
    company: 'Google',
    role: 'Frontend Engineer',
    status: 'Interview',
    notes: 'Phone screen went really well. The team seems great.',
    jobLink: 'https://careers.google.com',
    appliedDate: new Date('2026-03-15'),
    tags: ['Dream', 'Remote'],
    resume: 'resume-v3-2026.pdf',
    salary: '$150k–$200k',
    location: 'Mountain View, CA',
    followUpDate: new Date('2026-04-12'),
    interviewDates: [new Date('2026-04-05'), new Date('2026-04-10')],
  },
  {
    company: 'Stripe',
    role: 'Full Stack Developer',
    status: 'Applied',
    notes: 'Referral from a college friend on the payments team.',
    jobLink: 'https://stripe.com/jobs',
    appliedDate: new Date('2026-03-20'),
    tags: ['Referral', 'Hybrid'],
    resume: 'resume-v3-2026.pdf',
    salary: '$140k–$180k',
    location: 'San Francisco, CA',
  },
  {
    company: 'Notion',
    role: 'React Developer',
    status: 'Wishlist',
    notes: 'Great culture and product. Saving for later application.',
    jobLink: 'https://notion.so/careers',
    appliedDate: new Date('2026-04-01'),
    tags: ['Dream', 'Remote'],
    resume: '',
    salary: '$130k–$160k',
    location: 'Remote',
  },
  {
    company: 'Linear',
    role: 'Software Engineer',
    status: 'Offer',
    notes: 'Received offer! Negotiating equity. Team is amazing.',
    jobLink: 'https://linear.app/careers',
    appliedDate: new Date('2026-02-10'),
    tags: ['Dream', 'Remote'],
    resume: 'resume-v2-2025.pdf',
    salary: '$160k–$200k',
    location: 'Remote',
  },
  {
    company: 'Vercel',
    role: 'Frontend Developer',
    status: 'Rejected',
    notes: 'Did not pass system design round. Great feedback though.',
    jobLink: 'https://vercel.com/careers',
    appliedDate: new Date('2026-01-25'),
    tags: ['Remote'],
    resume: 'resume-v2-2025.pdf',
    salary: '$130k–$170k',
    location: 'Remote',
  },
  {
    company: 'Figma',
    role: 'UI Engineer',
    status: 'Applied',
    notes: 'Applied through company website.',
    jobLink: 'https://figma.com/careers',
    appliedDate: new Date('2026-04-02'),
    tags: ['Dream', 'On-site'],
    resume: 'resume-v3-2026.pdf',
    salary: '$140k–$175k',
    location: 'New York, NY',
  },
  {
    company: 'Shopify',
    role: 'Backend Developer',
    status: 'Interview',
    notes: 'Technical round is scheduled for next week.',
    jobLink: 'https://shopify.com/careers',
    appliedDate: new Date('2026-03-28'),
    tags: ['Remote'],
    resume: 'resume-v3-2026.pdf',
    salary: '$135k–$165k',
    location: 'Remote',
    followUpDate: new Date('2026-04-15'),
    interviewDates: [new Date('2026-04-10')],
  },
  {
    company: 'Airbnb',
    role: 'Product Engineer',
    status: 'Wishlist',
    notes: 'Very interested in the design tools team.',
    jobLink: 'https://airbnb.com/careers',
    appliedDate: new Date('2026-04-05'),
    tags: ['Hybrid'],
    resume: '',
    salary: '$145k–$185k',
    location: 'San Francisco, CA',
  },
  {
    company: 'Netflix',
    role: 'Senior React Developer',
    status: 'Applied',
    notes: 'Always been a dream. Applying for UI Platform team.',
    jobLink: 'https://netflix.com/jobs',
    appliedDate: new Date('2026-03-30'),
    tags: ['Dream', 'Hybrid'],
    resume: 'resume-v3-2026.pdf',
    salary: '$200k–$250k',
    location: 'Los Gatos, CA',
  },
  {
    company: 'Atlassian',
    role: 'Frontend Engineer',
    status: 'Rejected',
    notes: 'Good feedback received. Will re-apply in 6 months.',
    jobLink: 'https://atlassian.com/careers',
    appliedDate: new Date('2026-02-18'),
    tags: ['Remote'],
    resume: 'resume-v2-2025.pdf',
    salary: '$130k–$160k',
    location: 'Remote',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    let user = await User.findOne({ email: 'test@skillgraph.com' });
    if (!user) {
      user = await User.create({
        name: 'Test User',
        email: 'test@skillgraph.com',
        password: 'password123',
      });
      console.log('Test user created: test@skillgraph.com / password123');
    } else {
      console.log('Test user already exists');
    }

    await Job.deleteMany({ user: user._id });
    console.log('Cleared existing jobs');

    for (const jobData of sampleJobs) {
      const job = new Job({ ...jobData, user: user._id });
      job.activityLog.push({ action: 'Created', detail: `Added to ${jobData.status}` });
      if (jobData.status !== 'Wishlist') {
        job.activityLog.push({ action: 'Status changed', detail: `Wishlist → ${jobData.status}` });
      }
      await job.save();
    }

    console.log(`Inserted ${sampleJobs.length} sample jobs with activity logs`);
    await mongoose.disconnect();
    console.log('Seeding complete!');
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
}

seed();
