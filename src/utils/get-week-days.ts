interface GetWeekDaysProps {
  short?: boolean
}

export function getWeekDays({ short = false }: GetWeekDaysProps = {}) {
  const formatter = new Intl.DateTimeFormat("pt-BR", { weekday: "long" })

  // const test = .map(day => formatter.format())
  const list = Array.from(Array(7).keys())
  const days = list.map((day) => formatter.format(Date.UTC(2021, 5, day)))

  const formatDays = days.map((day) =>
    short
      ? day.substring(0, 3).toUpperCase().concat(".")
      : day.substring(0, 1).toUpperCase().concat(day.substring(1))
  )

  return formatDays
}
