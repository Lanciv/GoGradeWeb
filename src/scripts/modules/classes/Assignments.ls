require! {
  React
  Fluxxor

  "../../components/Panel.ls"
  '../../components/NewTable.ls'
  '../../components/ActionRenderer.ls'

  "../../api/api.ls"
}

Dom = React.DOM
{div, h1, img, span, ul,li, a, i, button} = Dom

{Grid, StringRenderer} = NewTable

assignment-cols =
  * key: 'name'
    display: 'Name'

  * key: 'dueDate'
    display: 'Due Date'
    format: 'date'

  * key: 'type.name'
    display: 'Type'

  * key: 'type.maxScore'
    display: 'Max Grade'

  * key: 'type.weight'
    display: 'Weight'
    format: 'decimalPercent'
    class-name: 'col-md-1'

  * display: 'Actions'
    renderer: ActionRenderer
    link-to: 'class'
    class-name: 'col-md-3'

ClassAssignments = React.create-class do
  displayName: "ClassAssignments"
  get-initial-state: ->
    assignments: []
    class: {}

  component-will-mount: !->
    api.assignment.find classId: @props.params.resource-id
      .then !~>
        @set-state do
          assignments: it[0]
    api.class.get @props.params.resource-id
      .then !~>
        @set-state do
          class: it

  render-assignments: (xs) ->
    | !xs       => 'Loading...'
    | otherwise => assignments-template xs

  render: ->
    Panel hasBody: false title: "Assignments",
      Grid columns: assignment-cols, data: @state.assignments


module.exports = ClassAssignments
