import { defineCollection, z } from "astro:content";

export const coursesValues: string[] = [
  "2 - 4 mois",
  "4 - 6 mois",
  "6 mois et +",
  "Rééducation",
  "Intermédiaire",
  "Avancé",
  "CSAU",
];

const teachers = [
  "sandrine",
  "laurent",
  "fred",
  "lena",
  "nathalie",
  "yohann",
  "marie",
  "patrick",
  "anthony",
  "valerie",
  "christophe",
  "badis",
  "kevin",
  "guillaume",
  "dominique",
] as const;

const coursesCollection = defineCollection({
  type: "content",
  schema: z.object({
    date: z.date(),
    courses: z.array(
      z.object({
        hour_interval: z.string(),
        courseName: z.enum(coursesValues),
        teachers: z.array(z.enum(teachers)),
      }),
    ),
  }),
});

export const collections = {
  courses: coursesCollection,
};
