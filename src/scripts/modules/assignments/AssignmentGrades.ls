require! {
  'react': React

  '../../components/NewTable.ls'

  "../../api/api.ls"

  '../../components/PageHeader.ls': Header

}
Dom = React.DOM
{div, input, i} = Dom

{Grid} = NewTable


{find} = require 'prelude-ls'

GradeInput = React.create-class do
  get-initial-state: ->
    initial-value: @props.value
    value: @props.value
    grade-id: @props.row.grade?.id
    max-score: @props.column.max-score
    loading: false
    error: false

  on-change: ->
    @set-state value: it.target.value

  change-loading: (loading, error)->
    set-timeout do
      @set-state.bind @, loading: loading, error: error || false
      300ms

  save-change: ->
    it.prevent-default!
    if @state.initial-value !== @state.value
      data =
        student-id: @props.row.student.id
        assignment-id: @props.column.assignment-id
        grade: @state.value

      @set-state loading: true

      if !@state.grade-id
        api.grade.create data
          .then ~>
            @change-loading false
          .catch ~>
            @refs.grade-input.get-inputDOM-Node!.focus!
            @change-loading false, true
      else
        api.grade.update @state.grade-id, data
          .then ~>
            @change-loading false
          .catch ~>
            @refs.grade-input.getDOMNode!.focus!
            @change-loading false, true

  render: ->
    render-icon = ~>
      if @state.loading
        i class-name: "spinner loading icon"
      else if @state.error
        i class-name: "red circular inverted attention sign icon"
      else
        i class-name: "icon",
          " / #{@state.max-score}"

    div class-name: "ui icon input #{'error' if @state.error}",
      input do
        type: "text"
        class-name: "grade"
        placeholder: "Score"
        on-blur: @save-change
        value: @state.value
        on-change: @on-change

      render-icon!


AssignmentGrades = React.create-class do
  displayName: "AssignmentGrades"
  get-initial-state: ->
    students: []
    grades: []
    assignment: {}

  get-grades: ->
    api.grade.find {assignment-id: @props.params.assignment-id}
      .then ~>
        @set-state grades: it[0]

  get-students: ->
    api.enrollment.find {class-id: @state.assignment.class-id, term-id: @state.assignment.term-id}
      .then ~>
        @set-state students: it[0]

  get-assignment: ->
    api.assignment.get @props.params.assignment-id
      .then ~>
        @set-state assignment: it
      .then ~>
        @get-grades!
        @get-students!

  build-cols: ->
    cols = [
      * key: "student.name"
        display: "Student"
        class-name: "three wide"
      * key: "grade.comment"
        display: "Comments"
      * key: "grade.grade"
        display: "Grade"
        assignment-id: @props.params.assignment-id
        max-score: @state.assignment?.type?.max-score
        renderer: GradeInput
    ]

    cols

  build-data: ->
    for x in @state.students
      result =
        student:
          id: x.student.id
          name: "#{x.person.firstName} #{x.person.lastName}"
        grade: find (.student-id is x.student-id), @state.grades

      result

  component-will-mount: ->
    api.grade.events.add-listener "change", @get-grades

    @get-assignment!


  component-will-unmount: ->
    api.grade.events.remove-listener "change", @get-grades

  render: ->
    div null,
      Header primary: @state.assignment?.name, secondary: @state.assignment?.type?.name
      div class-name: "main container",
        Grid columns: @build-cols!, data: @build-data!

module.exports = AssignmentGrades
