require! {
  React: 'react'
  Link: './HighlightedLink.ls'
  Router: "react-router"
  select: "./src/modules/Dropdown.ls"

  '../api/api.ls'
  '../api/auth.ls'
}

Dom = React.DOM
{div, i, a} = Dom

HeaderNav = React.create-class do
  displayName: "HeaderNav"
  user-display-name: ->
    "#{@state.person.firstName} #{@state.person.lastName}"

  component-will-mount: ->
    person-id = auth.current-user!.person-id
    if person-id then
      api.person.get person-id
        .then ~>
          @set-state person: it

  get-initial-state: ->
    person: {}

  render: ->
    div class-name: "ui fixed teal inverted main menu",
      div class-name: "container",
        div class-name: "title item",
          "Cunae Gradebook"
        Link class-name: "item" to: "dashboard",
          i class-name:"home icon"
          " Home"
        Link class-name: "item" to: "class",
          "Classes"
        Link class-name: "item" to: "people",
          "People"
        Link class-name: "item" to: "school.settings",
          "School Settings"
        div class-name: "right menu",
          div class-name: "item",
            @user-display-name!
          Link class-name:"item" to: "logout",
            "Logout"


module.exports = HeaderNav
