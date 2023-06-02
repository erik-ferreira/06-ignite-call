import dayjs from "dayjs"
import { useMemo, useState } from "react"

import { CaretLeft, CaretRight } from "phosphor-react"

import { getWeekDays } from "@/src/utils/get-week-days"

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

interface CalendarProps {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
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

  const calendarWeeks = useMemo(() => {
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
      ...daysInMonthArray.map((date) => ({
        date,
        disabled: date.endOf("day").isBefore(new Date()),
      })),
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
  }, [currentDate])

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth}, <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous month">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
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
