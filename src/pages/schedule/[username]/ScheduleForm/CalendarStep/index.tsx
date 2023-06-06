import dayjs from "dayjs"
import { useState } from "react"
import { useRouter } from "next/router"
import { useQuery } from "@tanstack/react-query"

import { Calendar } from "@/src/components/Calendar"

import { api } from "../../../../../lib/api"

import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from "./styles"

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const router = useRouter()

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const isDateSelected = !!selectedDate
  const username = String(router.query.username)

  const dayExtension = selectedDate ? dayjs(selectedDate).format("dddd") : null
  const weekDay = dayExtension
    ? dayExtension
        .substring(0, 1)
        .toUpperCase()
        .concat(dayExtension.substring(1))
    : null
  const describeDate = selectedDate
    ? dayjs(selectedDate).format("DD[ de ]MMMM")
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : null

  const { data: availability } = useQuery<Availability>(
    ["availability", selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })

      return response.data
    },
    { enabled: !!selectedDate }
  )

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set("hour", hour)
      .startOf("hour")
      .toDate()

    onSelectDateTime(dateWithTime)
  }

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describeDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.possibleTimes.map((hour) => {
              const disabledItem = !availability.availableTimes.includes(hour)
              const hourFormat = String(hour).padStart(2, "0")

              return (
                <TimePickerItem
                  key={hour}
                  disabled={disabledItem}
                  onClick={() => handleSelectTime(hour)}
                >
                  {hourFormat}:00h
                </TimePickerItem>
              )
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
