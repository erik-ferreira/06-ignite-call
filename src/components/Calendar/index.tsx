import dayjs from "dayjs"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { CaretLeft, CaretRight } from "phosphor-react"

import { api } from "../../lib/api"
import { getWeekDays } from "@/src/utils/get-week-days"

import { ButtonIcon } from "../ButtonIcon"

import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from "./styles"

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

interface BlockedDates {
  blockedWeekDays: number[]
  blockedMonthDays: number[]
}

interface CalendarProps {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const router = useRouter()
  const shortWeekDays = getWeekDays({ short: true })

  const [currentDate, setCurrentDate] = useState(() => dayjs().set("date", 1))

  const currentMonth = currentDate.format("MMMM")
  const currentYear = currentDate.format("YYYY")

  function handlePreviousMonth() {
    const previousMonth = currentDate.subtract(1, "month")

    setCurrentDate(previousMonth)
  }

  function handleNextMonth() {
    const nextMonth = currentDate.add(1, "month")

    setCurrentDate(nextMonth)
  }

  const username = String(router.query.username)
  const year = currentDate.get("year")
  const month = currentDate.get("month")

  const { data: blockedDates } = useQuery<BlockedDates>(
    ["blocked-dates", year, month],
    async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year,
          month: String(month).padStart(2, "0"),
        },
      })

      return response.data
    }
  )

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    const daysInMonth = currentDate.daysInMonth()

    const daysInMonthArray = Array.from({
      length: daysInMonth,
    }).map((_, i) => currentDate.set("date", i + 1))

    const firstWeekDay = currentDate.get("day")

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => currentDate.subtract(i + 1, "day"))
      .reverse()

    const lastDayInCurrentMonth = currentDate.set("date", daysInMonth)
    const lastWeekDay = lastDayInCurrentMonth.get("day")

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => lastDayInCurrentMonth.add(i + 1, "day"))

    const calendarDays = [
      ...previousMonthFillArray.map((date) => ({ date, disabled: true })),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf("day").isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(date.get("day")) ||
            blockedDates.blockedMonthDays.includes(date.get("date")),
        }
      }),
      ...nextMonthFillArray.map((date) => ({ date, disabled: true })),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeek[]>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      []
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth}, <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <ButtonIcon onClick={handlePreviousMonth} title="Previous month">
            <CaretLeft />
          </ButtonIcon>
          <ButtonIcon onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </ButtonIcon>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <CalendarDay
                        disabled={disabled}
                        onClick={() => onDateSelected(date.toDate())}
                      >
                        {date.get("date")}
                      </CalendarDay>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
