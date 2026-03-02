import NavigationBar from "@/components/Navbar";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import TechStackSection from "@/components/skill-section";
import ProtofolioSection from "@/components/protofolio-section";
import ContactSection from "@/components/contact-section";
import { CommentSection } from "@/components/comments/comment-section";
import { prisma } from "@/lib/prisma";

async function getProfile() {
  try {
    return await prisma.profile.findFirst();
  } catch { return null; }
}

async function getProjects() {
  try {
    return await prisma.project.findMany({ orderBy: { order: "asc" } });
  } catch { return null; }
}

async function getSkills() {
  try {
    return await prisma.skill.findMany({ orderBy: { order: "asc" } });
  } catch { return null; }
}

export default async function Home() {
  const [profile, projects, skills] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <NavigationBar />
      <HeroSection profile={profile ?? undefined} />
      <AboutSection profile={profile ?? undefined} />
      <TechStackSection skills={skills?.length ? skills : undefined} />
      <ProtofolioSection projects={projects?.length ? projects : undefined} />
      {/* <ContactSection /> */}
      <CommentSection />
    </main>
  );
}