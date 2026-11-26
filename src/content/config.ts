import { defineCollection, z } from "astro:content";

export const coursesValues: string[] = [
  "2 - 4 mois",
  "4 - 6 mois",
  "6 mois et +",
  "Rééducation",
  "Intermédiaire",
  "Tous niveaux",
  "CSAU",
  "Secrétariat",
];

const teachers = [
  "sandrine",
  "laurent",
  "fred",
  "lena",
  "nathalie",
  "yoan",
  "marie",
  "patrick",
  "anthony",
  "valerie",
  "christophe",
  "badis",
  "kevin",
  "guillaume",
  "dominique",
  "martineC",
  "martineD",
  "ghita",
  "anneSophie",
] as const;

const coursesCollection = defineCollection({
  type: "content",
  schema: z.object({
    // one entry per day with courses (e.g. a Wednesday and a Saturday in the same week)
    days: z.array(
      z.object({
        date: z.coerce.date(),
        courses: z.array(
          z.object({
            hour_interval: z.string(),
            courseName: z.enum(coursesValues),
            teachers: z.array(z.enum(teachers)),
          }),
        ),
      }),
    ),
  }),
});

export const collections = {
  courses: coursesCollection,
};
