const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { faker } = require("@faker-js/faker");

const {
  Goals,
  Levels,
  Tech,
  NotificationType,
  Role,
} = require("@prisma/client");

async function main() {
  const techArray = Object.values(Tech);
  const userIds = [];
  const postIds = [];
  const meetupIds = [];
  const podcastIds = [];
  const groupIds = [];

  // USERS
  for (let i = 0; i < 20; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.exampleEmail(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: faker.internet.displayName(),
        level: faker.helpers.enumValue(Levels),
        bio: faker.person.bio(),
        image: faker.image.avatar(),
        goal: faker.helpers.enumValue(Goals),
        tech: faker.helpers.arrayElements(techArray),
      },
    });
    userIds.push(user.id);
  }

  // GROUPS
  for (let i = 0; i < 20; i++) {
    const authorId = faker.helpers.arrayElement(userIds);
    const group = await prisma.group.create({
      data: {
        name: faker.lorem.sentence(),
        about: faker.lorem.paragraph(2),
        coverImage: faker.image.url(),
        profileImage: faker.image.avatar(),
        createdBy: authorId,
      },
    });
    groupIds.push(group.id);

    const usedUserIds = new Set();
    usedUserIds.add(authorId);

    const adminIds = faker.helpers.arrayElements(
      userIds.filter((id) => !usedUserIds.has(id)),
      3
    );
    adminIds.forEach((id: unknown) => usedUserIds.add(id));

    const memberIds = faker.helpers.arrayElements(
      userIds.filter((id) => !usedUserIds.has(id)),
      7
    );
    memberIds.forEach((id: unknown) => usedUserIds.add(id));

    await prisma.groupUser.createMany({
      data: [
        { groupId: group.id, userId: authorId, role: Role.OWNER },
        ...adminIds.map((userId: any) => ({
          groupId: group.id,
          userId,
          role: Role.ADMIN,
        })),
        ...memberIds.map((userId: any) => ({
          groupId: group.id,
          userId,
          role: Role.MEMBER,
        })),
      ],
    });
  }

  // POSTS
  for (let i = 0; i < 50; i++) {
    const post = await prisma.post.create({
      data: {
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraph(2),
        likes: faker.number.int(400),
        views: faker.number.int(1000),
        image: faker.image.url(),
        tags: faker.lorem.words().split(" "),
        group: {
          connect: {
            id: faker.helpers.arrayElement(groupIds),
          },
        },
        user: {
          connect: {
            id: faker.helpers.arrayElement(userIds),
          },
        },
      },
    });
    postIds.push(post.id);
  }

  // MEETUPS
  for (let i = 0; i < 40; i++) {
    const streetAddress = faker.location.streetAddress();
    const city = faker.location.city();
    const state = faker.location.state({ abbreviated: true });
    const zipCode = faker.location.zipCode();

    const meetup = await prisma.meetup.create({
      data: {
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraph(2),
        startTime: faker.date.future(),
        address: `${streetAddress} ${city}, ${state} ${zipCode}`,
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        likes: faker.number.int(400),
        views: faker.number.int(1000),
        image: faker.image.url(),
        tags: faker.lorem.words().split(" "),
        group: {
          connect: {
            id: faker.helpers.arrayElement(groupIds),
          },
        },
        user: {
          connect: {
            id: faker.helpers.arrayElement(userIds),
          },
        },
      },
    });
    meetupIds.push(meetup.id);
  }

  // PODCASTS
  for (let i = 0; i < 30; i++) {
    const podcast = await prisma.podcast.create({
      data: {
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraph(2),
        likes: faker.number.int(800),
        views: faker.number.int(800),
        image: faker.image.url(),
        audio:
          "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
        tags: faker.lorem.words().split(" "),
        group: {
          connect: {
            id: faker.helpers.arrayElement(groupIds),
          },
        },
        user: {
          connect: {
            id: faker.helpers.arrayElement(userIds),
          },
        },
      },
    });
    podcastIds.push(podcast.id);
  }

  // COMMENTS
  for (let i = 0; i < 100; i++) {
    const postIsIncluded = faker.datatype.boolean();
    const meetupIsIncluded = faker.datatype.boolean();
    const podcastIsIncluded = faker.datatype.boolean();

    await prisma.comment.create({
      data: {
        body: faker.lorem.paragraph(2),
        likes: faker.number.int(800),
        ...(postIsIncluded && {
          post: {
            connect: { id: faker.helpers.arrayElement(postIds) },
          },
        }),
        ...(meetupIsIncluded && {
          meetup: {
            connect: { id: faker.helpers.arrayElement(meetupIds) },
          },
        }),
        ...(podcastIsIncluded && {
          podcast: {
            connect: { id: faker.helpers.arrayElement(podcastIds) },
          },
        }),
        author: {
          connect: {
            id: faker.helpers.arrayElement(userIds),
          },
        },
      },
    });
  }

  // NOTIFICATIONS
  for (let i = 0; i < 30; i++) {
    const notificationType = faker.helpers.enumValue(NotificationType);

    await prisma.notification.create({
      data: {
        owner: {
          connect: {
            id: faker.helpers.arrayElement(userIds),
          },
        },
        actionBy: {
          connect: {
            id: faker.helpers.arrayElement(userIds),
          },
        },
        type: notificationType,
        ...(notificationType !== NotificationType.follow && {
          post: {
            connect: { id: faker.helpers.arrayElement(postIds) },
          },
        }),
        read: faker.datatype.boolean(),
      },
    });
  }
}

main();
