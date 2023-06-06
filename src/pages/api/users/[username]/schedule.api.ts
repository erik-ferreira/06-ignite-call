import { z } from "zod"
import dayjs from "dayjs"
import { NextApiRequest, NextApiResponse } from "next"

import { prisma } from "../../../../lib/prisma"

const createSChedulingBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  observations: z.string(),
  date: z.string().datetime(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  const username = String(req.query.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: "User does not exist." })
  }

  const { name, email, observations, date } = createSChedulingBodySchema.parse(
    req.body
  )

  const schedulingDate = dayjs(date).startOf("hour")
  const schedulingDateIsBeforeToday = schedulingDate.isBefore(new Date())

  if (schedulingDateIsBeforeToday) {
    return res.status(400).json({ message: "Date is in the past." })
  }

  const conflitingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  })

  if (conflitingScheduling) {
    return res
      .status(400)
      .json({ message: "There is another scheduling at the same time." })
  }

  await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  })

  return res.status(201).end()
}
