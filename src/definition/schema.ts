import { z } from "zod"

export const definition = z.object({
  "home-step": z.object({
    category: z.union([z.literal("recruiter"), z.literal("worker"), z.literal("")]),
  }),
  "recruiter-step": z.object({
    company: z.string().min(1),
    searchedSkill: z.string().min(1),
  }),
  "worker-step": z.object({
    name: z.string().min(1),
    favoriteSkill: z.string().min(1),
  }),
  "confirmation-step": z.object({
    message: z.string(),
  }),
})

export type Definition = z.infer<typeof definition>

// const test = makeSchema({
//   schema: z.object({
//     firstName: z.string(),
//     preference: z.enum(["email", "sms"]),
//   }),
//   defaultValues: {
//     firstName: "toto",
//     preference: "email",
//   },
// })

// export type Definition = {
//   [key: string]: {
//     title: string
//     schema: z.AnyZodObject
//     route: string
//   }
// }

// type MapZod = {
//   [key in keyof Definition]: z.infer<Definition[key]["schema"]>
// }

// export function extractSchema(definition: Definition): MapZod {
//   return Object.entries(definition).reduce((acc, [key, value]) => {
//     acc[key] = value.schema
//     return acc
//   }, {} as Record<string, z.AnyZodObject>)
// }

// export const definition: Definition = {
//   "home-step": {
//     title: "Index",
//     schema: z.object({
//       category: z.union([z.literal("recruiter"), z.literal("worker"), z.literal("")]),
//     }),
//     route: "/",
//   },
//   "recruiter-step": {
//     title: "Recruteur",
//     schema: z.object({
//       company: z.string().min(1),
//       searchedSkill: z.string().min(1),
//     }),
//     route: "/recruteur",
//   },
//   "worker-step": {
//     title: "Travailleur",
//     schema: z.object({
//       name: z.string().min(1),
//       favoriteSkill: z.string().min(1),
//     }),
//     route: "/travailleur",
//   },
//   "confirmation-step": {
//     title: "Confirmation",
//     schema: z.object({
//       message: z.string(),
//     }),
//     route: "/confirmation",
//   },
// } as const
