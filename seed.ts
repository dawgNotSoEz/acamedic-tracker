import { PrismaClient, TaskStatus, Priority, Difficulty, StudySessionStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding real Supabase database with starter learning datasets...");

  // Clean existing data
  console.log("Cleaning existing database...");
  await prisma.studySession.deleteMany({});
  await prisma.taskResource.deleteMany({});
  await prisma.resourceTag.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.day.deleteMany({});
  await prisma.week.deleteMany({});
  await prisma.resource.deleteMany({});
  await prisma.roadmap.deleteMany({});

  console.log("Inserting Cybersecurity Roadmap...");
  const roadmap = await prisma.roadmap.create({
    data: {
      title: "June Cybersecurity Speedrun",
      description: "Advanced curriculum covering OWASP, Network Security, Active Directory, and Privilege Escalation",
    },
  });

  console.log("Inserting Weeks...");
  const week1 = await prisma.week.create({
    data: {
      roadmapId: roadmap.id,
      number: 1,
      title: "OWASP Top 10 & Basics",
      startDate: new Date("2026-06-01"),
      endDate: new Date("2026-06-07"),
    },
  });

  const week2 = await prisma.week.create({
    data: {
      roadmapId: roadmap.id,
      number: 2,
      title: "Network Security & Penetration Testing",
      startDate: new Date("2026-06-08"),
      endDate: new Date("2026-06-14"),
    },
  });

  const week3 = await prisma.week.create({
    data: {
      roadmapId: roadmap.id,
      number: 3,
      title: "Active Directory & Exam Prep",
      startDate: new Date("2026-06-15"),
      endDate: new Date("2026-06-21"),
    },
  });

  console.log("Inserting Days...");
  const w1d1 = await prisma.day.create({
    data: {
      weekId: week1.id,
      dayNumber: 1,
      date: new Date("2026-06-01"),
      title: "OWASP Web Security",
    },
  });

  const w1d2 = await prisma.day.create({
    data: {
      weekId: week1.id,
      dayNumber: 2,
      date: new Date("2026-06-02"),
      title: "Score Systems & CVSS",
    },
  });

  const w2d1 = await prisma.day.create({
    data: {
      weekId: week2.id,
      dayNumber: 1,
      date: new Date("2026-06-08"),
      title: "Port Scanning & Recon",
    },
  });

  console.log("Inserting Resources...");
  const res1 = await prisma.resource.create({
    data: {
      title: "OWASP Top 10 Cheatsheet",
      type: "LINK",
      url: "https://owasp.org/www-project-top-ten/",
      content: "Complete breakdown of the latest OWASP Top 10 vulnerabilities.",
      category: "Reference",
      difficulty: Difficulty.EASY,
    },
  });

  const res2 = await prisma.resource.create({
    data: {
      title: "Burp Suite Tutorial Guide",
      type: "LINK",
      url: "https://portswigger.net/burp/documentation/desktop/quickstart",
      content: "Official PortSwigger starter tutorials for Proxy, Intruder, and Repeater.",
      category: "Practice",
      difficulty: Difficulty.MEDIUM,
    },
  });

  const res3 = await prisma.resource.create({
    data: {
      title: "HackTheBox Active Labs",
      type: "LINK",
      url: "https://www.hackthebox.com/",
      content: "Intensive target machines for penetration testing practice.",
      category: "Practice",
      difficulty: Difficulty.HARD,
    },
  });

  console.log("Inserting Tasks...");
  const t1 = await prisma.task.create({
    data: {
      roadmapId: roadmap.id,
      weekId: week1.id,
      dayId: w1d1.id,
      title: "Review OWASP Top 10 vulnerabilities",
      description: "Perform deep study on SQLi, XSS, and broken access control.",
      estimateMins: 60,
      status: TaskStatus.DONE,
      priority: Priority.HIGH,
      category: "OWASP",
    },
  });

  const t2 = await prisma.task.create({
    data: {
      roadmapId: roadmap.id,
      weekId: week1.id,
      dayId: w1d2.id,
      title: "CVSS Scoring Basics & Practice",
      description: "Learn metric calculation rules and score common CVEs.",
      estimateMins: 45,
      status: TaskStatus.DONE,
      priority: Priority.MEDIUM,
      category: "OWASP",
    },
  });

  const t3 = await prisma.task.create({
    data: {
      roadmapId: roadmap.id,
      weekId: week2.id,
      dayId: w2d1.id,
      title: "Practice SQL Injection Detection",
      description: "Complete PortSwigger Academy labs on SQL injection.",
      estimateMins: 90,
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      category: "Networks",
    },
  });

  const t4 = await prisma.task.create({
    data: {
      roadmapId: roadmap.id,
      weekId: week2.id,
      dayId: w2d1.id,
      title: "Nmap Advanced Scripts Run",
      description: "Scan local lab targets using advanced NSE vulnerability scripts.",
      estimateMins: 60,
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      category: "Networks",
    },
  });

  const t5 = await prisma.task.create({
    data: {
      roadmapId: roadmap.id,
      title: "Read Burp Suite Intruder Guide",
      description: "Learn payload types, intruder attacks, and response grepping.",
      estimateMins: 30,
      status: TaskStatus.TODO,
      priority: Priority.LOW,
      category: "BurpSuite",
    },
  });

  // Connect task and resources
  await prisma.taskResource.create({
    data: { taskId: t1.id, resourceId: res1.id },
  });
  await prisma.taskResource.create({
    data: { taskId: t3.id, resourceId: res2.id },
  });

  console.log("Inserting Study Sessions...");
  // Create a paused/completed study session in the past
  await prisma.studySession.create({
    data: {
      taskId: t1.id,
      resourceId: res1.id,
      startAt: new Date("2026-06-02T10:00:00Z"),
      endAt: new Date("2026-06-02T11:00:00Z"),
      accumulatedMins: 60,
      durationMins: 60,
      status: StudySessionStatus.STOPPED,
      category: "OWASP",
      notes: "Reviewed OWASP Top 10 injection flows.",
    },
  });

  // Create an active study session for Today
  await prisma.studySession.create({
    data: {
      taskId: t3.id,
      resourceId: res2.id,
      startAt: new Date(),
      currentIntervalStart: new Date(),
      accumulatedMins: 15,
      status: StudySessionStatus.ACTIVE,
      category: "Networks",
      notes: "Practicing SQL injection payload queries.",
    },
  });

  console.log("Seeding completed successfully! Supabase database is now fully populated with live real records.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
