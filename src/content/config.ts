import { defineCollection, z } from "astro:content";

const coursesCollection = defineCollection({
  type: "content",
  schema: z.object({
    text: z.string(),
  }),
});

export const collections = {
  courses: coursesCollection,
};
