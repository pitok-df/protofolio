import { PrismaClient } from '../lib/generated/prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import "dotenv/config";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
    console.log('Seeding database...');

    // Create Profile
    const profile = await prisma.profile.create({
        data: {
            name: "Pito Desri Pauzi",
            headline: "Full Stack Developer",
            bio: "Saya seorang mahasiswa semester 6 dengan minat besar di dunia full-stack development. Berpengalaman dalam mengembangkan sistem backend dan merancang antarmuka pengguna yang sederhana namun efektif. Saya selalu berusaha menulis kode yang bersih dan mudah dipelihara, serta menciptakan desain yang fokus pada kebutuhan pengguna.",
            imageUrl: "/pito-desri-pauzi.webp",
            githubUrl: "https://github.com/PitokDf",
            linkedinUrl: "https://www.linkedin.com/in/pito-desri-pauzi-181052314",
        },
    });
    console.log('Profile seeded:', profile.name);

    // Create Skills
    const fallbackSkills = [
        { name: "React", category: "Frontend", level: 85, description: "Building interactive UIs", iconColor: "from-blue-400 to-blue-600", order: 1 },
        { name: "Next.js", category: "Framework", level: 82, description: "Full-stack React framework", iconColor: "from-gray-600 to-gray-900", order: 2 },
        { name: "TypeScript", category: "Language", level: 80, description: "Type-safe JavaScript", iconColor: "from-blue-500 to-blue-700", order: 3 },
        { name: "Node.js", category: "Backend", level: 78, description: "Server-side JavaScript", iconColor: "from-green-500 to-green-700", order: 4 },
        { name: "Express.js", category: "Backend", level: 75, description: "Web framework for Node.js", iconColor: "from-gray-500 to-gray-800", order: 5 },
        { name: "Prisma", category: "ORM", level: 80, description: "Next-gen ORM", iconColor: "from-indigo-500 to-purple-600", order: 6 },
        { name: "PostgreSQL", category: "Database", level: 75, description: "Relational database", iconColor: "from-blue-600 to-indigo-600", order: 7 },
        { name: "Git", category: "Tools", level: 85, description: "Version control system", iconColor: "from-orange-500 to-red-600", order: 8 },
        { name: "Tailwind CSS", category: "Styling", level: 88, description: "Utility-first CSS", iconColor: "from-cyan-400 to-blue-500", order: 9 },
    ];

    for (const skill of fallbackSkills) {
        await prisma.skill.create({ data: skill });
    }
    console.log(`Seeded ${fallbackSkills.length} skills.`);

    // Create Projects
    const fallbackProjects = [
        { title: "Pencatatan Pengeluaran", description: "Sistem untuk mencatat pengeluaran dengan dashboard yang mudah dipahami dan fitur analisis keuangan.", tags: ["Next.js", "PostgreSQL", "TypeScript", "Prisma"], imageUrl: "/pencatatan-pengeluaran.png", link: "https://catatan-pengeluaran-three.vercel.app/", featured: true, order: 1 },
        { title: "IT Ventory", description: "Aplikasi manajemen inventaris barang dengan fitur pencatatan dan pelacakan yang efisien.", tags: ["Laravel", "MySQL", "Node.js"], imageUrl: "/it-ventory.png", link: "http://it-ventory.kesug.com/", featured: true, order: 2 },
        { title: "KMIPN PNP", description: "Platform untuk mengelola partisipasi tim dan proposal dalam Kompetisi Mahasiswa Nasional bidang Informatika.", tags: ["Express.js", "Prisma", "Next.js", "TypeScript", "PostgreSQL"], imageUrl: "/kmipn-pnp.png", link: "https://kmipn.pnp.ac.id/", featured: true, order: 3 },
        { title: "Scheduler Course", description: "Aplikasi untuk menjadwalkan mata kuliah dengan fitur manajemen waktu.", tags: ["Express.js", "Prisma", "Next.js", "TypeScript"], imageUrl: "/schedule-project.png", link: "https://schedule-course.vercel.app/schedule", featured: false, order: 4 },
    ];

    for (const project of fallbackProjects) {
        await prisma.project.create({ data: project });
    }
    console.log(`Seeded ${fallbackProjects.length} projects.`);

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
