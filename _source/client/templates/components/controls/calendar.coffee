class Apollos.Controls.Calendar extends Apollos.Component
  @register "Apollos.Controls.Calendar"

  events: -> [
    "click": @.stop
    "click [data-month]": @.changeMonth
    "click [data-day]": @.changeDay
    "click [data-dismiss]": @.dismiss
  ]

  vars: -> super.concat [
    today: null
    firstDay: null
    lastDay: null
  ]


  onCreated: ->

    self = @
    self.parent = self.data().parent

    self.today.set moment().startOf("day")

    self.autorun ->
      today = self.today.get()
      self.firstDay.set moment(today).startOf("month").startOf("week").startOf("day")
      self.lastDay.set moment(today).endOf("month").endOf("week").startOf("day")

  stop: (event) ->

    event.stopPropagation()
    event.preventDefault()

  dismiss: (event) ->
    @.parent.calendarInstance = null

    Blaze.remove @._internals.templateInstance.view

    @.stop(event) if event

    return

  month: ->
    self = @
    today = self.today.get()
    "#{today.format("MMMM")} #{today.format("YYYY")}"

  days: ->
    self = @

    days = []

    today = self.today.get()
    startOfMonth = moment(today).startOf("month")
    endOfMonth = moment(today).endOf("month")
    day = self.firstDay.get()
    end = self.lastDay.get()
    i = 0

    schedule = self.getSchedule()

    while day <= end
      obj =
        day: day.format("D")
        unix: day.unix()
        notThisMonth: day < startOfMonth or day > endOfMonth
        index: i
        selected: day.unix() is today.unix()
        inSchedule: schedule?.matches(day)
      days.push(obj)
      day.add(1, "day")
      i += 1

    return days

  headerDays: ->
    [
      { day: 'S' }
      { day: 'M' }
      { day: 'T' }
      { day: 'W' }
      { day: 'T' }
      { day: 'F' }
      { day: 'S' }
    ]

  startRow: (index) ->
    index % 7 is 0

  endRow: (index) ->
    index % 7 is 6

  changeMonth: (event) ->
    self = @

    event.preventDefault()

    direction = event.target.dataset.month
    today = self.today.get()

    if direction is "prev"
      today.subtract(1, 'month')
    else
      today.add(1, 'month')

    self.today.set today

  changeDay: (event) ->
    self = @

    event.preventDefault()

    unix = event.target.dataset.day
    today = moment.unix(unix)

    self.today.set today

  getSchedule: ->
    self = @

    frequency = self.parent.parent().frequencyType.get()
    today = self.today.get()

    switch frequency
      when "Once"
        return null
      when "Weekly"
        return moment(today).recur().every(1).weeks()
      when "Biweekly"
        return moment(today).recur().every(2).weeks()
      when "Twice Monthly"
        return moment(today).recur().every([1,15]).daysOfMonth()
      when "Monthly"
        return moment(today).recur().every(1).months()
      when "Quarterly"
        return moment(today).recur().every(3).months()
      when "Yearly"
        return moment(today).recur().every(1).years()
