import { PrismaClient, UserRole, CourseLevel, CourseStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminId = uuid();
  const teacherId = uuid();
  const studentId = uuid();

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ahlearning.com' },
    update: {},
    create: {
      id: adminId,
      firebaseUid: 'admin-firebase-uid',
      email: 'admin@ahlearning.com',
      firstName: 'Platform',
      lastName: 'Admin',
      displayName: 'Platform Admin',
      role: UserRole.ADMIN,
      isEmailVerified: true,
      isActive: true,
      headline: 'Platform Administrator',
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@ahlearning.com' },
    update: {},
    create: {
      id: teacherId,
      firebaseUid: 'teacher-firebase-uid',
      email: 'teacher@ahlearning.com',
      firstName: 'John',
      lastName: 'Teacher',
      displayName: 'John Teacher',
      role: UserRole.TEACHER,
      isEmailVerified: true,
      isActive: true,
      isTeacherApproved: true,
      headline: 'Full-Stack Web Development Instructor',
      bio: 'Experienced developer with 10+ years teaching coding.',
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@ahlearning.com' },
    update: {},
    create: {
      id: studentId,
      firebaseUid: 'student-firebase-uid',
      email: 'student@ahlearning.com',
      firstName: 'Jane',
      lastName: 'Student',
      displayName: 'Jane Student',
      role: UserRole.STUDENT,
      isEmailVerified: true,
      isActive: true,
      headline: 'Lifelong Learner',
    },
  });

  console.log('Users created:', { admin: admin.email, teacher: teacher.email, student: student.email });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: { name: 'Web Development', slug: 'web-development', description: 'Build modern web applications', icon: 'Globe', color: '#3b82f6', sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: 'mobile-development' },
      update: {},
      create: { name: 'Mobile Development', slug: 'mobile-development', description: 'iOS and Android app development', icon: 'Smartphone', color: '#8b5cf6', sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: 'data-science' },
      update: {},
      create: { name: 'Data Science', slug: 'data-science', description: 'Data analysis, ML, and AI', icon: 'BarChart', color: '#06b6d4', sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: 'devops' },
      update: {},
      create: { name: 'DevOps', slug: 'devops', description: 'CI/CD, cloud, and infrastructure', icon: 'Cloud', color: '#f59e0b', sortOrder: 4 },
    }),
    prisma.category.upsert({
      where: { slug: 'design' },
      update: {},
      create: { name: 'Design', slug: 'design', description: 'UI/UX, graphic, and product design', icon: 'Palette', color: '#ec4899', sortOrder: 5 },
    }),
  ]);

  console.log('Categories created:', categories.length);

  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: 'javascript' }, update: {}, create: { name: 'JavaScript', slug: 'javascript' } }),
    prisma.tag.upsert({ where: { slug: 'typescript' }, update: {}, create: { name: 'TypeScript', slug: 'typescript' } }),
    prisma.tag.upsert({ where: { slug: 'react' }, update: {}, create: { name: 'React', slug: 'react' } }),
    prisma.tag.upsert({ where: { slug: 'nodejs' }, update: {}, create: { name: 'Node.js', slug: 'nodejs' } }),
    prisma.tag.upsert({ where: { slug: 'python' }, update: {}, create: { name: 'Python', slug: 'python' } }),
    prisma.tag.upsert({ where: { slug: 'nextjs' }, update: {}, create: { name: 'Next.js', slug: 'nextjs' } }),
    prisma.tag.upsert({ where: { slug: 'nestjs' }, update: {}, create: { name: 'NestJS', slug: 'nestjs' } }),
    prisma.tag.upsert({ where: { slug: 'postgresql' }, update: {}, create: { name: 'PostgreSQL', slug: 'postgresql' } }),
  ]);

  console.log('Tags created:', tags.length);

  const course1 = await prisma.course.upsert({
    where: { slug: 'complete-web-development-bootcamp' },
    update: {},
    create: {
      title: 'Complete Web Development Bootcamp 2025',
      slug: 'complete-web-development-bootcamp',
      subtitle: 'Learn HTML, CSS, JavaScript, React, Node.js and more',
      description: 'The most comprehensive web development course. Build real-world projects and launch your career as a full-stack developer.',
      price: 84.99,
      discountPrice: 12.99,
      level: CourseLevel.BEGINNER,
      language: 'English',
      duration: 24000,
      totalLessons: 150,
      totalSections: 12,
      totalDuration: 24000,
      status: CourseStatus.PUBLISHED,
      isFeatured: true,
      totalEnrollments: 15000,
      averageRating: 4.7,
      totalRatings: 8500,
      popularityScore: 98.5,
      teacherId: teacherId,
      categoryId: categories[0]?.id,
      publishedAt: new Date(),
    },
  });

  const course2 = await prisma.course.upsert({
    where: { slug: 'advanced-react-and-nextjs' },
    update: {},
    create: {
      title: 'Advanced React & Next.js: Build Production Apps',
      slug: 'advanced-react-and-nextjs',
      subtitle: 'Master React 19, Next.js 15, Server Components, and more',
      description: 'Take your React skills to the next level. Learn advanced patterns, performance optimization, and production deployment.',
      price: 94.99,
      discountPrice: 14.99,
      level: CourseLevel.ADVANCED,
      language: 'English',
      duration: 18000,
      totalLessons: 100,
      totalSections: 10,
      totalDuration: 18000,
      status: CourseStatus.PUBLISHED,
      isFeatured: true,
      totalEnrollments: 8500,
      averageRating: 4.8,
      totalRatings: 4200,
      popularityScore: 92.3,
      teacherId: teacherId,
      categoryId: categories[0]?.id,
      publishedAt: new Date(),
    },
  });

  console.log('Courses created:', course1.title, course2.title);

  const tags1 = await prisma.courseTag.createMany({
    data: [
      { courseId: course1.id, tagId: tags[0]!.id },
      { courseId: course1.id, tagId: tags[1]!.id },
      { courseId: course1.id, tagId: tags[2]!.id },
      { courseId: course1.id, tagId: tags[3]!.id },
      { courseId: course2.id, tagId: tags[1]!.id },
      { courseId: course2.id, tagId: tags[2]!.id },
      { courseId: course2.id, tagId: tags[5]!.id },
    ],
    skipDuplicates: true,
  });

  const section1 = await prisma.section.create({
    data: {
      title: 'Introduction to Web Development',
      description: 'Get started with the basics of web development',
      sortOrder: 0,
      courseId: course1.id,
    },
  });

  const section2 = await prisma.section.create({
    data: {
      title: 'HTML & CSS Fundamentals',
      description: 'Learn the building blocks of the web',
      sortOrder: 1,
      courseId: course1.id,
    },
  });

  const section3 = await prisma.section.create({
    data: {
      title: 'JavaScript Essentials',
      description: 'Master JavaScript programming',
      sortOrder: 2,
      courseId: course1.id,
    },
  });

  console.log('Sections created for course1');

  const enrollment = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: studentId, courseId: course1.id } },
    update: {},
    create: {
      userId: studentId,
      courseId: course1.id,
      status: 'ACTIVE',
      progress: 35,
      completedLessons: 5,
      totalLessons: 3,
    },
  });

  console.log('Enrollment created:', enrollment.id);

  const analytics = await prisma.courseAnalytics.upsert({
    where: { courseId: course1.id },
    update: {},
    create: {
      courseId: course1.id,
      totalViews: 45000,
      uniqueViewers: 15000,
      totalWatchTime: 720000,
      averageWatchTime: 48.5,
      completionRate: 35.2,
      totalEnrollments: 15000,
      totalCompletions: 5250,
      totalReviews: 8500,
      averageRating: 4.7,
      retentionRate: 72.3,
      dropOffRate: 27.7,
    },
  });

  const auditLog = await prisma.auditLog.create({
    data: {
      action: 'SYSTEM_SEED',
      resource: 'Database',
      description: 'Initial database seeding completed',
      actorId: adminId,
    },
  });

  console.log('Seed completed successfully!');
  console.log('');
  console.log('Login Credentials:');
  console.log('  Admin:   admin@ahlearning.com');
  console.log('  Teacher: teacher@ahlearning.com');
  console.log('  Student: student@ahlearning.com');
  console.log('');
  console.log('Note: Authentication requires Firebase. Use Firebase console to create users with these emails.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
