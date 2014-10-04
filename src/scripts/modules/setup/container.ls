require! {
  React: 'react'

  Header: '../../components/PageHeader.ls'

  Link: 'react-router'.Link
}
Dom = React.DOM
{div} = Dom

Container = React.create-class do
  displayName: "Container"

  render: ->
    div null,
      Header primary: "App Setup"
      div class-name: "main container",
        div class-name: "ui stackable grid",
          div class-name: "thirteen wide column",
            @props.active-route-handler!
          div class-name: "right floated three wide column",
            div class-name: "ui fluid vertical menu sunken",
              Link class-name: "item" to: "setup.assignment-types", "Assignment Types"

module.exports =
  Container:       Container
  AssignmentTypes: require './AssignmentTypes.ls'